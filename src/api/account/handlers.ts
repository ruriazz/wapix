import { type Handlers } from './domain/@interface';
import newAccountDomainService from './services';
import { authenticatedResponse, profileResponse } from './domain/serializer';
import { type ApiContext, type Manager } from '@vendor';
import { Status, sendJson } from '@utils/api/response';
import { authenticatedHandler } from '@decorators/authentication';
import { defaultMessage } from '@src/const';

const newAccountHandler = (manager: Manager): Handlers => {
    const usecase = newAccountDomainService(manager);

    return new (class implements Handlers {
        async auth(ctx: ApiContext): Promise<void> {
            const authData = await usecase.defaultAuthentication(ctx, {
                email: ctx.request.body.email,
                password: ctx.request.body.password,
            });
            if (authData != null && authData.authToken != '') {
                sendJson(ctx, {
                    data: authenticatedResponse(authData),
                    status: Status.Accepted,
                });
                return;
            } else if (authData != null && authData.authToken == '') {
                sendJson(ctx, {
                    status: Status.Unauthorized,
                    message: defaultMessage.AUTH_MANY_TRIES,
                });
                return;
            }

            sendJson(ctx, { status: Status.Unauthorized, message: defaultMessage.AUTH_ERROR_INFO });
        }

        @authenticatedHandler(manager)
        async profile(ctx: ApiContext): Promise<void> {
            sendJson(ctx, { data: profileResponse(ctx.authData?.account!) });
        }

        @authenticatedHandler(manager, true)
        async refreshToken(ctx: ApiContext): Promise<void> {
            const result = await usecase.refreshToken(ctx, ctx.request.body['refreshToken']);
            if (result) {
                return sendJson(ctx, { data: authenticatedResponse(result), status: Status.Accepted });
            }
            sendJson(ctx, { status: Status.Unauthorized, message: defaultMessage.AUTH_TOKEN_VALIDATION_ERROR });
        }
    })();
};

export default newAccountHandler;
