import { AccountRole, Account } from "@src/entities/_types";
import { ApiContext } from "@vendor";


export interface _AccountRepository {
    findOne: (filter: Record<string, any>, ctx?: ApiContext) => Promise<Account | null | undefined>
    createOne: (account: Account, ctx?: ApiContext) => Promise<Account | undefined>;
}

export interface _AccountRoleRepository {
    findOne(filter: Record<string, any>, ctx?: ApiContext): Promise<AccountRole | null | undefined>
}