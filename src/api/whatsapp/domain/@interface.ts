import { WhatsappEnrollSession } from '@entity/@typed';
import { SocketContext, type ApiContext } from '@vendor';
import { Namespace } from 'socket.io';

export type Handlers = {
    createEnrollSession: (ctx: ApiContext) => Promise<void>;

    wsPatchSession: (namespace: Namespace) => Promise<void>;
};

export type Services = {
    createEnrollSession: (ctx: ApiContext | null, enrollData: WhatsappEnrollSession) => Promise<boolean>;
};

export type SocketServices = {
    enrollSessionDispatch: (socket: SocketContext) => Promise<void>;
};
