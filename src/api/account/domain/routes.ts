import { type Manager } from '@vendor';
import { type Router } from 'express';
import newAccountHandler from '@api/account/handlers';
import { useApiContext } from '@utils/api/middleware';
import { authSchema, refreshTokenSchema } from './validator';

const initAccountAPIRoute = (manager: Manager): Router => {
    const handler = newAccountHandler(manager);
    const router = manager.Server.Router();

    router.post('/account/auth', authSchema, useApiContext(handler.auth));
    router.get('/account/profile', useApiContext(handler.profile));
    router.put('/account/auth', refreshTokenSchema, useApiContext(handler.refreshToken));

    return router;
};

export default initAccountAPIRoute;
