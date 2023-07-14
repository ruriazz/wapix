import { Manager, SocketContext, WhatsappClient } from '@vendor';
import { SocketServices } from './domain/@interface';
import Whatsapp from '@src/extensions/whatsapp';
import newWhatsappRepository from '@repo/whatsapp';
import { SocketEvent } from '@utils/socket/socketEvent';
import { defaultMessage, whatsappClientStatus } from '@const';
import newWhatsappClientRepository from '@src/repositories/whatsappClient';

const newWhatsappDomainSocketService = (manager: Manager): SocketServices => {
    const whatsappRepo = newWhatsappRepository(manager);
    const whatsappClientRepo = newWhatsappClientRepository(manager);

    return new (class implements SocketServices {
        async enrollSessionDispatch(socket: SocketContext): Promise<void> {
            let authenticationSuccess = false;
            const whatsapp = new Whatsapp(manager);

            const session = await whatsappRepo.getEnrollSession(socket.handshake.query.session as string);
            let whatsappClient: WhatsappClient | undefined = undefined;

            if (session) {
                const storedWhatsappClient = await whatsappClientRepo.findOne({ number: session.phoneNumber });
                if (storedWhatsappClient && storedWhatsappClient.status == whatsappClientStatus.UNAUTHORIZED) {
                    whatsappClient = await whatsapp.getClient(session.phoneNumber);

                    const onQrReceived = (value: string) =>
                        socket.emit(SocketEvent.ClientAuthentication, { authFor: session.phoneNumber, qrString: value, receivedAt: new Date() });
                    const onAuthSuccess = async (err: Error | undefined) => {
                        if (err) {
                            socket.emit(SocketEvent.Error, err.message);
                        } else {
                            authenticationSuccess = true;
                            socket.emit(SocketEvent.ClientAuthenticated, true);
                            await whatsappClientRepo.updateOne(storedWhatsappClient, { updatedAt: new Date(), status: whatsappClientStatus.PENDING });
                        }

                        await whatsappRepo.removeEnrollSession(session);
                        socket.disconnect();
                    };

                    whatsapp.listenAuth(whatsappClient, onQrReceived, onAuthSuccess);
                } else {
                    socket.emit(SocketEvent.Error, defaultMessage.WA_AUTHORIZED_CLIENT);
                    socket.disconnect();
                }
            } else {
                socket.emit(SocketEvent.Error, defaultMessage.WA_ENROLL_SESSION_ERROR);
                socket.disconnect();
            }

            socket.on(SocketEvent.Disconnect, async () => {
                if (session && !authenticationSuccess) {
                    try {
                        whatsapp.destroyClient(whatsappClient!);
                    } catch (error) {}
                }
            });
        }
    })();
};

export default newWhatsappDomainSocketService;
