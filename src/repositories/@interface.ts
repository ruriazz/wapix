import { type AccountRole, type Account, type AuthSession } from '@src/entities/@typed';
import { type ApiContext } from '@vendor';

export type _AccountRepository = {
    findOne: (filter: Record<string, any>, ctx?: ApiContext) => Promise<Account | null>;
    createOne: (account: Account, ctx?: ApiContext) => Promise<Account | undefined>;
};

export type _AccountRoleRepository = {
    findOne: (filter: Record<string, any>, ctx?: ApiContext) => Promise<AccountRole | null | undefined>;
};

export type _AuthSessionRepository = {
    findLastUnauthorizeSession: (account: Account) => Promise<AuthSession | null>;
    findOneByObjectId: (strObjectId: string) => Promise<AuthSession | null>;
    createOne: (authSession: AuthSession) => Promise<AuthSession | undefined>;
    updateOne: (authSession: AuthSession, newData: Record<string, any>) => Promise<boolean>;
    removeOne: (authSession: AuthSession) => Promise<boolean>;
};
