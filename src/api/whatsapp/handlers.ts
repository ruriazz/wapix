import { ApiContext, Manager } from '@vendor';
import { Handlers } from '@api/whatsapp/domain/@interface';
import { authenticatedHandler, authenticatedSocket } from '@decorators/authentication';
import { Status, sendJson } from '@utils/api/response';
import { Namespace, Socket } from 'socket.io';
import newWhatsappDomainService from './services';
import { WhatsappEnrollSession } from '@entity/@typed';
import { getUid } from '@helpers/ids';
import { SocketEvent } from '@utils/socket/socketEvent';
import newWhatsappDomainSocketService from './socketService';
import { defaultMessage } from '@const';

const newWhatsappHandler = (manager: Manager): Handlers => {
    const socketAuth = (socket: Socket, next: Function) => authenticatedSocket(manager, socket, next);

    const service = newWhatsappDomainService(manager);
    const socketService = newWhatsappDomainSocketService(manager);

    return new (class implements Handlers {
        @authenticatedHandler(manager)
        async createEnrollSession(ctx: ApiContext): Promise<void> {
            const enrollData = {
                uid: getUid(),
                name: ctx.request.body.name,
                phoneNumber: ctx.request.body.phoneNumber,
            } as WhatsappEnrollSession;

            const created = await service.createEnrollSession(ctx, enrollData);

            if (!created) {
                return sendJson(ctx, {
                    status: Status.BadRequest,
                    message: defaultMessage.WA_AUTHORIZED_CLIENT,
                });
            }

            sendJson(ctx, {
                status: Status.Created,
                data: {
                    wsPath: '/ws',
                    wsNamespace: '/patch/whatsapp/session',
                    wsQuery: { session: enrollData.uid },
                    page: `http://localhost:8800/enroll-session.html?uid=${enrollData.uid}`,
                },
            });
        }

        async wsPatchSession(io: Namespace): Promise<void> {
            io.use(socketAuth);
            io.on(SocketEvent.Connection, socketService.enrollSessionDispatch);
        }
    })();
};

export default newWhatsappHandler;
