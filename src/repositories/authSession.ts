import { type Manager } from '@vendor';
import { type _AuthSessionRepository } from './@interface';
import AuthSessionModel, { type AuthSession } from '@entity/authSession';
import { type Account } from '@src/entities/@typed';
import { Types } from 'mongoose';

const newAuthSessionRepository = (manager: Manager) => {
    return new (class implements _AuthSessionRepository {
        async findLastUnauthorizeSession(account: Account): Promise<AuthSession | null> {
            try {
                const result = await AuthSessionModel.find({
                    account: account._id,
                    authorizedAt: { $eq: null },
                })
                    .sort({ lastAttempt: -1 })
                    .exec();

                if (result.length > 0) {
                    return result[0];
                }

                return null;
            } catch (err) {
                manager.Log.error({
                    message: 'AuthSessionRepository.findLastUnauthorizeSession Exception',
                    error: err,
                });
                return null;
            }
        }

        async findOneByObjectId(strObjectId: string): Promise<AuthSession | null> {
            const objectId = new Types.ObjectId(strObjectId);
            const result = await AuthSessionModel.findOne({ _id: objectId });
            return result;
        }

        async createOne(authSession: AuthSession): Promise<AuthSession | undefined> {
            try {
                const session = new AuthSessionModel(authSession);
                const result = await session.save();
                return result;
            } catch (err) {
                manager.Log.error({
                    message: 'AuthSessionRepository.createOne Exception',
                    error: err,
                });
            }
        }

        async updateOne(authSession: AuthSession, newData: Record<string, any>): Promise<boolean> {
            try {
                await AuthSessionModel.updateOne({ _id: authSession._id }, { $set: newData }).exec();
                return true;
            } catch (err) {
                manager.Log.error({
                    message: 'AuthSessionRepository.updateOne Exception',
                    error: err,
                });
                return false;
            }
        }

        async removeOne(authSession: AuthSession): Promise<boolean> {
            try {
                await AuthSessionModel.findByIdAndRemove(authSession._id).exec();
                return true;
            } catch (err) {
                manager.Log.error({
                    message: 'AuthSessionRepository.removeOne Exception',
                    error: err,
                });
                return false;
            }
        }
    })();
};

export default newAuthSessionRepository;
