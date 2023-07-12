import newAccountRepository from '@repo/account';
import newAuthSessionRepository from '@repo/authSession';
import { Status, sendJson, sendString } from '@utils/api/response';
import { parseJwt, sha256Verify, verifyBasicAuth, verifyPassword } from '@helpers/hash';
import { SocketContext, type ApiContext, type Manager } from '@vendor';
import { defaultMessage } from '@const';

class ExposedError extends Error {}

const authenticatedHandler = (manager: Manager, allowExpired = false) => {
    const authSessionRepo = newAuthSessionRepository(manager);
    const accountRepo = newAccountRepository(manager);

    return (target: Function, context: Record<string, any>) => {
        if (context.kind === 'method') {
            return async function (this: any, ...args: any[]) {
                const ctx = args[0] as ApiContext;
                const authHeader = ctx.request.headers.authorization;

                try {
                    if (!authHeader) {
                        throw new ExposedError(defaultMessage.AUTH_TOKEN_NOT_FOUND);
                    }

                    const stringJwt = authHeader.split('Bearer ')[1].trim();
                    const decoded = parseJwt(stringJwt, allowExpired)!;
                    const authSession = await authSessionRepo.findOneByObjectId(decoded.session);
                    const account = await accountRepo.findOne({
                        _id: authSession?.account,
                    });
                    const validToken = await verifyPassword(authSession?.authToken!, stringJwt);
                    if (!sha256Verify(account?.uid!, decoded.account) || !validToken) {
                        throw new ExposedError(defaultMessage.AUTH_ERROR_SIGNATURE);
                    }

                    if (!account?.enable) {
                        throw new ExposedError(defaultMessage.AUTH_INACTIVE_ACCOUNT);
                    }

                    ctx.authData = {
                        account,
                        encodedToken: stringJwt,
                        decodedToken: decoded,
                    };
                } catch (err) {
                    const responseProp = {
                        status: Status.Unauthorized,
                        message: defaultMessage.AUTH_TOKEN_VALIDATION_ERROR,
                    };
                    if (err instanceof ExposedError) {
                        responseProp.message = err.message;
                    }

                    sendJson(ctx, responseProp);
                    return;
                }
                return target.apply(this, [ctx]);
            };
        }
    };
};

const authenticatedSocket = async (manager: Manager, socket: SocketContext, next: Function) => {
    const authSessionRepo = newAuthSessionRepository(manager);
    const accountRepo = newAccountRepository(manager);

    try {
        const token = socket.handshake.auth.Bearer || 'none';
        const decoded = parseJwt(token, false)!;
        const authSession = await authSessionRepo.findOneByObjectId(decoded.session);
        const account = await accountRepo.findOne({
            _id: authSession?.account,
        });
        const validToken = await verifyPassword(authSession?.authToken!, token);
        if (!sha256Verify(account?.uid!, decoded.account) || !validToken) {
            throw new ExposedError(defaultMessage.AUTH_ERROR_SIGNATURE);
        }

        if (!account?.enable) {
            throw new ExposedError(defaultMessage.AUTH_INACTIVE_ACCOUNT);
        }

        socket.authData = {
            account,
            encodedToken: token,
            decodedToken: decoded,
        };
        next();
    } catch (err) {
        if (err instanceof ExposedError) {
            return next(err);
        }

        next(new Error('Unauthorized'));
    }
};

const authenticatedInternalWebhook = (manager: Manager) => {
    return (target: Function, context: Record<string, any>) => {
        if (context.kind === 'method') {
            return async function (this: any, ...args: any[]) {
                const ctx = args[0] as ApiContext;
                const authHeader = ctx.request.headers.authorization;

                try {
                    if (!authHeader || (ctx.request.ip != '::ffff:127.0.0.1' && ctx.request.ip != '::1')) {
                        throw new Error();
                    }

                    const token = authHeader.split('Basic ')[1].trim();
                    const verified = await verifyBasicAuth(token, manager.Settings.INTERNAL_HOOK_USER, manager.Settings.INTERNAL_HOOK_SECRET);
                    if (!verified) {
                        throw new Error();
                    }
                } catch (err) {
                    console.log('ERROR NIHHH', err);
                    sendString(ctx, { status: Status.Unauthorized });
                    return;
                }
                return target.apply(this, [ctx]);
            };
        }
    };
};

export { authenticatedHandler, authenticatedSocket, authenticatedInternalWebhook };
