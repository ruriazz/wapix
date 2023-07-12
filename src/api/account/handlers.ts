import { UpdateInfoData, type Handlers } from './domain/@interface';
import newAccountDomainService from './services';
import { authenticatedResponse, profileResponse, updateInfoResponse } from './domain/serializer';
import { type ApiContext, type Manager } from '@vendor';
import { Status, sendJson } from '@utils/api/response';
import { authenticatedHandler } from '@decorators/authentication';
import { defaultMessage } from '@const';

const newAccountHandler = (manager: Manager): Handlers => {
    const service = newAccountDomainService(manager);

    return new (class implements Handlers {
        async auth(ctx: ApiContext): Promise<void> {
            const authData = await service.defaultAuthentication(ctx, {
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
            const result = await service.refreshToken(ctx, ctx.request.body.refreshToken);
            if (result) {
                return sendJson(ctx, { data: authenticatedResponse(result), status: Status.Accepted });
            }
            sendJson(ctx, { status: Status.Unauthorized, message: defaultMessage.AUTH_TOKEN_VALIDATION_ERROR });
        }

        @authenticatedHandler(manager)
        async updateInfo(ctx: ApiContext): Promise<void> {
            const result = await service.updateAccountInfo(ctx, {
                newName: ctx.request.body.newName,
                newEmail: ctx.request.body.newEmail,
                newPassword: ctx.request.body.newPassword,
                password: ctx.request.body.password,
            } as UpdateInfoData);

            if (!result.success) {
                return sendJson(ctx, {
                    status: Status.BadRequest,
                    message: 'Validation Error',
                    data: { errors: result.errors },
                });
            }

            if (result.result) {
                return sendJson(ctx, {
                    status: Status.Ok,
                    data: updateInfoResponse(result.result),
                });
            }

            sendJson(ctx);
        }
    })();
};

export default newAccountHandler;
