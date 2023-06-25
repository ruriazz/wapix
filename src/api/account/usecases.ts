import { Usecases } from "./domain/_interface";
import { ApiContext, Manager } from "@vendor";
import { AuthData, AuthenticatedData } from "./domain/_types";
import { Account } from "@src/entities/_types";
import { makePassword, verifyPassword } from "@src/utils/helpers/hash";
import newAccountRepository from "@repo/account";
import newAccountRoleRepositoy from "@repo/accountRole";
import { accountRoleSlug } from "@const";

const newAccountDomainUsecase = (manager: Manager): Usecases => {
    const accountRepo = newAccountRepository(manager);
    const accountRoleRepo = newAccountRoleRepositoy(manager);

    return new class implements Usecases {
        async defaultAuthentication(ctx: ApiContext, data: AuthData): Promise<AuthenticatedData | undefined> {
            const account = await accountRepo.findOne({ email: data.email, enable: true });
            if (!account || !account.verifiedAt) {
                return;
            }

            const validPassword = await verifyPassword(account.password || "", data.password);
            if (!validPassword) {
                return;
            }


            return { account: account, authToken: "", refreshToken: "", expiredAt: new Date() };
        }
    }
}

export default newAccountDomainUsecase;