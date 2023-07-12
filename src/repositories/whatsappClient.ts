import { Manager } from '@vendor';
import { _WhatsappClientRepository } from './@interface';
import WhatsappClientModel, { WhatsappClient } from '@entity/whatsappClient';

const newWhatsappClientRepository = (manager: Manager): _WhatsappClientRepository => {
    return new (class implements _WhatsappClientRepository {
        async findOne(filter: Record<string, any>): Promise<WhatsappClient | null> {
            try {
                const result = await WhatsappClientModel.findOne(filter).exec();
                return Promise.resolve(result);
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappClientRepository.findOne Exception',
                    error: err,
                });
                return null;
            }
        }

        async createOne(whatsappClient: WhatsappClient): Promise<WhatsappClient | null> {
            try {
                const client = new WhatsappClientModel(whatsappClient);
                const result = await client.save();
                return result;
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappClientRepository.createOne Exception',
                    error: err,
                });
                return null;
            }
        }

        async updateOne(whatsappClient: WhatsappClient, newData: Record<string, any>): Promise<boolean> {
            try {
                await WhatsappClientModel.updateOne({ _id: whatsappClient._id }, { $set: newData });
                return true;
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappClientRepository.updateOne Exception',
                    error: err,
                });
                return false;
            }
        }

        // async findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<Account | null> {
        //     try {
        //         const result = await AccountModel.findOne(filter).exec();
        //         return await Promise.resolve(result);
        //     } catch (err) {
        // manager.Log.error({
        //     message: 'AccountRepository.findOneByEmail Exception',
        //     error: err,
        // });
        //         return null;
        //     }
        // }
    })();
};

export default newWhatsappClientRepository;
