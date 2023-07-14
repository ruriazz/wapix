import { WhatsappClient, WhatsappEnrollSession } from '@entity/@typed';
import { SocketContext, type ApiContext } from '@vendor';
import { Namespace } from 'socket.io';

export type Handlers = {
    createEnrollSession: (ctx: ApiContext) => Promise<void>;
    getClientCollection: (ctx: ApiContext) => Promise<void>;
    getClientDetail: (ctx: ApiContext) => Promise<void>;
    updateClientInfo: (ctx: ApiContext) => Promise<void>;

    wsPatchSession: (namespace: Namespace) => Promise<void>;
};

export type Services = {
    createEnrollSession: (ctx: ApiContext | null, enrollData: WhatsappEnrollSession) => Promise<boolean>;
    getClientCollection: (ctx: ApiContext) => Promise<WhatsappClient[]>;
    getClientDetail: (ctx: ApiContext, uid: string) => Promise<WhatsappClient | null>;
};

export type SocketServices = {
    enrollSessionDispatch: (socket: SocketContext) => Promise<void>;
};
