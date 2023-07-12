import { ApiContext, Manager } from '@vendor';
import { Services, SetAuthenticatedClient } from './domain/@interface';
import newWhatsappRepository from '@repo/whatsapp';
import { WhatsappClient, WhatsappEnrollSession } from '@entity/@typed';
import newWhatsappClientRepository from '@repo/whatsappClient';
import { whatsappClientStatus } from '@const';

const newWhatsappHookDomainService = (manager: Manager): Services => {
    const whatsappRepo = newWhatsappRepository(manager);
    const whatsappClientRepo = newWhatsappClientRepository(manager);

    return new (class implements Services {
        async setAuthenticatedClient(_: ApiContext, data: SetAuthenticatedClient): Promise<boolean> {
            const whatsappClient = await whatsappClientRepo.findOne({ number: data.number });
            if (!whatsappClient) {
                return false;
            } else if (whatsappClient && whatsappClient.status != whatsappClientStatus.PENDING) {
                return false;
            }

            const now = new Date();
            return await whatsappClientRepo.updateOne(whatsappClient, {
                updatedAt: now,
                authenticatedAt: now,
                status: whatsappClientStatus.OFFLINE,
                authCollection: data.auth,
            });
        }
    })();
};

export default newWhatsappHookDomainService;
