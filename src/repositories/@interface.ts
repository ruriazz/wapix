import { type AccountRole, type Account, type AuthSession, WhatsappEnrollSession, WhatsappClient } from '@entity/@typed';
import { type ApiContext } from '@vendor';

export type _AccountRepository = {
    findOne: (filter: Record<string, any>, ctx?: ApiContext) => Promise<Account | null>;
    createOne: (account: Account, ctx?: ApiContext) => Promise<Account | undefined>;
    updateOne: (account: Account, newData: Record<string, any>) => Promise<boolean>;
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

export type _WhatsappClientRepository = {
    findOne: (filter: Record<string, any>) => Promise<WhatsappClient | null>;
    createOne: (whatsappClient: WhatsappClient) => Promise<WhatsappClient | null>;
    updateOne: (whatsappClient: WhatsappClient, newData: Record<string, any>) => Promise<boolean>;
    findMany: (filter: Record<string, any>) => Promise<WhatsappClient[]>;
};

export type _WhatsappRepository = {
    saveEnrollSession: (data: WhatsappEnrollSession, seconds: number) => Promise<void>;
    getEnrollSession: (uid: string) => Promise<WhatsappEnrollSession | undefined>;
    removeEnrollSession: (data: WhatsappEnrollSession) => Promise<void>;
};
