import { _AccountRepository } from "./_interface";
import { ApiContext, Manager } from "@vendor";
import AccountModel, { Account } from "@entity/account";


const newAccountRepository = (manager: Manager) => {
    return new class implements _AccountRepository {
        async findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<Account | null | undefined> {
            try {
                const result = await AccountModel.findOne(filter).exec();
                return Promise.resolve(result);
            } catch (err) {
                manager.Log.error({ message: "AccountRepository.findOneByEmail Exception", error: err });
            }
        }

        async createOne(account: Account, ctx?: ApiContext): Promise<Account | undefined> {
            try {
                const _account = new AccountModel(account);
                const result = await _account.save()
                return result;
            } catch (err) {
                manager.Log.error({ message: "AccountRepository.createOne Exception", error: err });
            }
        }
    }
}

export default newAccountRepository;