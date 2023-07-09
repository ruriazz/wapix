import { type Manager } from '@vendor';

import initAccountAPIRoute from '@api/account/domain/routes';
import { initWhatsappAPIRoute, initWhatsappSocketNamespace } from '@api/whatsapp/domain/routes';
import { Socket } from 'socket.io';

interface CustomError extends Error {
    data: { content: string };
}

export default async function loadRouter(manager: Manager): Promise<void> {
    const routes = [
        initAccountAPIRoute(manager),
        initWhatsappAPIRoute(manager)
    ];

    initWhatsappSocketNamespace(manager);

    manager.Server.App.use(...routes);

    // manager.Server.Socket!.of('/patch-session').on('connection', (socket: Socket) => {
    //     console.log('new connection:', socket.id);
    // });

    // const patchSessionNamespace = manager.Server.Socket!.of('/patch-session');
    // patchSessionNamespace.on('connection', (socket: Socket) => {
    //     socket.on('disconnect', () => {
    //         console.log('Disconnected from /patch-session namespace:', socket.id);
    //     });
    // });

    Promise.resolve();
}
