import { type Manager } from '@vendor';

import initAccountAPIRoute from '@api/account/domain/routes';
import { initWhatsappAPIRoute, initWhatsappSocketNamespace } from '@api/whatsapp/domain/routes';

import initWhatsappHook from '@hook/whatsapp/domain/routes';

export default async function loadRouter(manager: Manager): Promise<void> {
    const apiRoutes = [initAccountAPIRoute(manager), initWhatsappAPIRoute(manager)];
    const webhookRoutes = [initWhatsappHook(manager)];

    initWhatsappSocketNamespace(manager);

    manager.Server.App.use(...apiRoutes, ...webhookRoutes);

    Promise.resolve();
}
