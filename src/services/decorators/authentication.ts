import newAccountRepository from '@repo/account';
import newAuthSessionRepository from '@repo/authSession';
import { Status, sendJson } from '@utils/api/response';
import { parseJwt, sha256Verify, verifyPassword } from '@helpers/hash';
import { type ApiContext, type Manager } from '@vendor';
import { defaultMessage } from '@src/const';

const authenticatedHandler = (manager: Manager, allowExpired = false) => {
    const authSessionRepo = newAuthSessionRepository(manager);
    const accountRepo = newAccountRepository(manager);

    class ExposedError extends Error {}

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

export { authenticatedHandler };
