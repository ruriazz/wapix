import { Router } from 'express';
import { Manager } from '@vendor';
import newWhatsappHandler from '@api/whatsapp/handlers';
import { useApiContext } from '@utils/api/middleware';
import { createEnrollSessionSchema, getClientDetailSchema, updateClientInfoSchema } from './validator';

const initWhatsappAPIRoute = (manager: Manager): Router => {
    const handler = newWhatsappHandler(manager);
    const router = manager.Server.Router();

    router.post('/whatsapp/session', createEnrollSessionSchema, useApiContext(handler.createEnrollSession));
    router.get('/whatsapp/client', useApiContext(handler.getClientCollection));
    router.get('/whatsapp/client/:uid', getClientDetailSchema, useApiContext(handler.getClientDetail));
    router.patch('/whatsapp/client/:uid', updateClientInfoSchema, useApiContext(handler.updateClientInfo));

    return router;
};

const initWhatsappSocketNamespace = (manager: Manager) => {
    const handler = newWhatsappHandler(manager);

    handler.wsPatchSession(manager.Server.Socket!.of('/patch/whatsapp/session'));
};

export { initWhatsappAPIRoute, initWhatsappSocketNamespace };
