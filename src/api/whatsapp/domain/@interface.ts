import { type ApiContext } from '@vendor';
import { Namespace } from 'socket.io';


export type Handlers = {
    getRegistrationLink: (ctx: ApiContext) => Promise<void>;

    wsPatchSession: (namespace: Namespace) => Promise<void>;
};

export type Services = {
};