import { ApiContext } from '@vendor';

export type Handlers = {
    postAuthenticatedClient: (ctx: ApiContext) => Promise<void>;
};

export type Services = {
    setAuthenticatedClient: (ctx: ApiContext, data: SetAuthenticatedClient) => Promise<boolean>;
};

export type SetAuthenticatedClient = {
    number: string;
    auth: string;
};
