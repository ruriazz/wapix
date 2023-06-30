import { type ApiContext } from '@vendor';
import { type Account } from '@src/entities/@typed';

export type Handlers = {
    auth: (ctx: ApiContext) => Promise<void>;
    profile: (ctx: ApiContext) => Promise<void>;
    refreshToken: (ctx: ApiContext) => Promise<void>;
};

export type Services = {
    defaultAuthentication: (ctx: ApiContext, data: AuthData) => Promise<AuthenticatedData | undefined>;
    refreshToken: (ctx: ApiContext, token: string) => Promise<AuthenticatedData | undefined>;
};

export type AuthData = { email: string; password: string };

export type AuthenticatedData = {
    account: Account;
    authToken: string;
    refreshToken: string;
};
