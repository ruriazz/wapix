import { ApiContext, Manager } from '@vendor';
import { Status, sendString } from '@utils/api/response';
import { Handlers } from './domain/@interface';
import { authenticatedInternalWebhook } from '@decorators/authentication';
import newWhatsappHookDomainService from './services';

const newWatsappHookHandler = (manager: Manager): Handlers => {
    const service = newWhatsappHookDomainService(manager);

    return new (class implements Handlers {
        @authenticatedInternalWebhook(manager)
        async postAuthenticatedClient(ctx: ApiContext): Promise<void> {
            const success = await service.setAuthenticatedClient(ctx, {
                number: ctx.request.body.number,
                auth: ctx.request.body.auth,
            });

            if (!success) {
                return sendString(ctx, { status: Status.BadRequest });
            }

            sendString(ctx);
        }
    })();
};

export default newWatsappHookHandler;
