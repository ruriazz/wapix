import { Manager } from '@vendor';
import { Router } from 'express';

import { useApiContext } from '@utils/api/middleware';
import { postAuthenticatedClientSchema } from './validator';
import newWatsappHookHandler from '@hook/whatsapp/handlers';

const initWhatsappHook = (manager: Manager): Router => {
    const handler = newWatsappHookHandler(manager);
    const router = manager.Server.Router();

    router.post('/hook/whatsapp/client', postAuthenticatedClientSchema, useApiContext(handler.postAuthenticatedClient));

    return router;
};

export default initWhatsappHook;
