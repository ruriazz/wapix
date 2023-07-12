import { ApiContext, Manager } from '@vendor';
import { Services } from './domain/@interface';
import newWhatsappRepository from '@repo/whatsapp';
import { WhatsappClient, WhatsappEnrollSession } from '@entity/@typed';
import newWhatsappClientRepository from '@repo/whatsappClient';
import { whatsappClientStatus } from '@const';

const newWhatsappDomainService = (manager: Manager): Services => {
    const whatsappRepo = newWhatsappRepository(manager);
    const whatsappClientRepo = newWhatsappClientRepository(manager);

    return new (class implements Services {
        async createEnrollSession(_: ApiContext | null, enrollData: WhatsappEnrollSession): Promise<boolean> {
            const existClient = await whatsappClientRepo.findOne({ number: enrollData.phoneNumber });
            if (existClient && existClient.status != whatsappClientStatus.UNAUTHORIZED) {
                return false;
            } else if (!existClient) {
                await whatsappClientRepo.createOne({
                    name: enrollData.name,
                    number: enrollData.phoneNumber,
                } as WhatsappClient);
            }

            await whatsappRepo.saveEnrollSession(enrollData);
            return true;
        }
    })();
};

export default newWhatsappDomainService;
