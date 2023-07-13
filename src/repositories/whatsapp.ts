import { Manager } from '@vendor';
import { _WhatsappRepository } from './@interface';
import { WhatsappEnrollSession } from '@entity/@typed';

const newWhatsappRepository = (manager: Manager) => {
    let redis = manager.Databases.Redis;

    return new (class implements _WhatsappRepository {
        async saveEnrollSession(data: WhatsappEnrollSession, seconds: number = 300): Promise<void> {
            try {
                const saved = await redis.set(data.uid, JSON.stringify(data), 'EX', seconds);
                if (saved != 'OK') {
                    throw new Error('failed save data to redis');
                }
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappRepository.saveEnrollSession Exception',
                    error: err,
                });
            }
        }

        async getEnrollSession(uid: string): Promise<WhatsappEnrollSession | undefined> {
            try {
                const saved = await redis.get(uid);
                return JSON.parse(saved!) as WhatsappEnrollSession;
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappRepository.getEnrollSession Exception',
                    error: err,
                });
            }
        }

        async removeEnrollSession(data: WhatsappEnrollSession): Promise<void> {
            try {
                await redis.del(data.uid);
            } catch (err) {
                manager.Log.error({
                    message: 'WhatsappRepository.removeEnrollSession Exception',
                    error: err,
                });
            }
        }
    })();
};

export default newWhatsappRepository;
