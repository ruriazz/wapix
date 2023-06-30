import { type _AccountRepository } from './@interface';
import { type ApiContext, type Manager } from '@vendor';
import AccountModel, { type Account } from '@entity/account';

const newAccountRepository = (manager: Manager) => {
    return new (class implements _AccountRepository {
        async findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<Account | null> {
            try {
                const result = await AccountModel.findOne(filter).exec();
                return await Promise.resolve(result);
            } catch (err) {
                manager.Log.error({
                    message: 'AccountRepository.findOneByEmail Exception',
                    error: err,
                });
                return null;
            }
        }

        async createOne(account: Account, ctx?: ApiContext): Promise<Account | undefined> {
            try {
                const _account = new AccountModel(account);
                const result = await _account.save();
                return result;
            } catch (err) {
                manager.Log.error({
                    message: 'AccountRepository.createOne Exception',
                    error: err,
                });
            }
        }

        async updateOne(account: Account, newData: Record<string, any>): Promise<boolean> {
            try {
                await AccountModel.updateOne({ _id: account._id }, { $set: newData }).exec();
                return true;
            } catch (err) {
                manager.Log.error({
                    message: 'AccountRepository.updateOne Exception',
                    error: err,
                });
                return false;
            }
        }
    })();
};

export default newAccountRepository;
