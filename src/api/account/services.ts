import { UpdateInfoData, type Services, UpdateInfoResult } from './domain/@interface';
import { type AuthData, type AuthenticatedData } from './domain/@interface';
import { type ApiContext, type Manager } from '@vendor';
import { type Account, type AuthSession } from '@entity/@typed';
import newAccountRepository from '@repo/account';
import newAccountRoleRepositoy from '@repo/accountRole';
import newAuthSessionRepository from '@repo/authSession';
import { staticSettings } from '@const';
import { createJwt, createToken, makePassword, verifyPassword } from '@helpers/hash';
import { Strings } from '@helpers/transform';

const newAccountDomainService = (manager: Manager): Services => {
    const accountRepo = newAccountRepository(manager);
    const accountRoleRepo = newAccountRoleRepositoy(manager);
    const authSessionRepo = newAuthSessionRepository(manager);

    return new (class implements Services {
        async defaultAuthentication(ctx: ApiContext, data: AuthData): Promise<AuthenticatedData | undefined> {
            const account = await accountRepo.findOne({
                email: data.email,
                enable: true,
            });
            if (account == null || account.verifiedAt == null) {
                return;
            }

            const allow = await this._validAuthCheck(account);
            if (!allow) {
                return {
                    account,
                    authToken: '',
                    refreshToken: '',
                };
            }

            const validPassword = await verifyPassword(account.password || '', data.password);
            if (!validPassword) {
                this._invalidPassword(account);
                return;
            }

            const refreshToken = createToken(staticSettings.REFRESH_TOKEN_LENGTH);
            const session = await this._authenticatedSession(account);
            const authToken = await createJwt(account, session);
            const encryptedToken = await makePassword(authToken, staticSettings.JWT_BCRYPT_ROUND);
            const encryptedRefreshToken = await makePassword(refreshToken, staticSettings.JWT_BCRYPT_ROUND);
            await authSessionRepo.updateOne(session, {
                authToken: encryptedToken,
                refreshToken: encryptedRefreshToken,
            });

            return { account, authToken, refreshToken };
        }

        async refreshToken(ctx: ApiContext, token: string): Promise<AuthenticatedData | undefined> {
            const now = new Date();
            const expiredDiff = ctx.authData!.decodedToken.exp! - now.getTime() / 1000;

            if (expiredDiff >= 10) {
                return {
                    account: ctx.authData?.account!,
                    authToken: ctx.authData?.encodedToken!,
                    refreshToken: token,
                };
            }

            let session = await authSessionRepo.findOneByObjectId(ctx.authData!.decodedToken.session);
            if (!session) {
                return;
            }

            const tokenValidated = await verifyPassword(session?.refreshToken!, token);
            if (!tokenValidated) {
                return;
            }

            await authSessionRepo.removeOne(session);

            session = await this._authenticatedSession(ctx.authData?.account!);
            const refreshToken = createToken(staticSettings.REFRESH_TOKEN_LENGTH);
            const authToken = await createJwt(ctx.authData?.account!, session);
            const encryptedToken = await makePassword(authToken, staticSettings.JWT_BCRYPT_ROUND);
            const encryptedRefreshToken = await makePassword(refreshToken, staticSettings.JWT_BCRYPT_ROUND);
            await authSessionRepo.updateOne(session, {
                authToken: encryptedToken,
                refreshToken: encryptedRefreshToken,
            });

            return { account: ctx.authData?.account!, authToken: authToken, refreshToken: refreshToken };
        }

        async updateAccountInfo(ctx: ApiContext, newData: UpdateInfoData): Promise<UpdateInfoResult> {
            const account = ctx.authData!.account;
            const passwordValidated = await verifyPassword(account.password!, newData.password);
            if (!passwordValidated) {
                return {
                    success: false,
                    errors: [
                        {
                            field: 'password',
                            message: 'wrong password',
                        },
                    ],
                } as UpdateInfoResult;
            }

            const errors: Record<string, any>[] = [];
            const fieldUpdate: Record<string, any> = {};

            if (newData.newName) {
                newData.newName = Strings.removeExtraWhitespace(newData.newName);
                fieldUpdate.name = Strings.toTitleCase(newData.newName);
            }

            if (newData.newEmail) {
                if (newData.newEmail != account.email) {
                    const existsEmail = await accountRepo.findOne({ email: newData.newEmail });
                    if (existsEmail) {
                        errors.push({ field: 'email', message: 'already in use' });
                    } else {
                        fieldUpdate.email = newData.newEmail;
                    }
                }
            }

            if (newData.newPassword) {
                fieldUpdate.password = await makePassword(newData.newPassword, staticSettings.PASSWORD_BCRYPTY_ROUND);
            }

            if (errors.length > 0) {
                return { success: false, errors: errors } as UpdateInfoResult;
            }

            await accountRepo.updateOne(account, fieldUpdate);

            return { success: true, result: await accountRepo.findOne({ uid: account.uid }) } as UpdateInfoResult;
        }

        private async _validAuthCheck(account: Account): Promise<boolean> {
            const lastAuth = await authSessionRepo.findLastUnauthorizeSession(account);
            if (lastAuth != null) {
                const attemptDiff = (new Date().getTime() - lastAuth.lastAttempt?.getTime()) / 1000;
                if (
                    lastAuth.attempt < staticSettings.AUTH_ATTEMPT_LIMIT ||
                    (lastAuth.attempt >= staticSettings.AUTH_ATTEMPT_LIMIT && attemptDiff >= staticSettings.INVALID_AUTH_TIMEOUT)
                ) {
                    return true;
                }

                await authSessionRepo.updateOne(lastAuth, {
                    attempt: lastAuth.attempt + 1,
                    lastAttempt: new Date(),
                });
                return false;
            }

            return true;
        }

        private async _invalidPassword(account: Account): Promise<undefined> {
            if (!account.uid) {
                return;
            }

            const lastAuth = await authSessionRepo.findLastUnauthorizeSession(account);
            if (lastAuth != null) {
                const attemptDiff = (new Date().getTime() - lastAuth.lastAttempt?.getTime()) / 1000;
                if (lastAuth.attempt < staticSettings.AUTH_ATTEMPT_LIMIT) {
                    await authSessionRepo.updateOne(lastAuth, {
                        attempt: lastAuth.attempt + 1,
                        lastAttempt: new Date(),
                    });
                    return;
                } else if (lastAuth.attempt >= staticSettings.AUTH_ATTEMPT_LIMIT && attemptDiff >= staticSettings.INVALID_AUTH_TIMEOUT) {
                    await authSessionRepo.updateOne(lastAuth, {
                        attempt: 1,
                        lastAttempt: new Date(),
                    });
                    return;
                }
            }

            await authSessionRepo.createOne({
                account: account._id,
                attempt: 1,
                lastAttempt: new Date(),
            } as AuthSession);
        }

        private async _authenticatedSession(account: Account): Promise<AuthSession> {
            const now = new Date();
            const lastAuth = await authSessionRepo.findLastUnauthorizeSession(account);
            if (lastAuth != null) {
                await authSessionRepo.updateOne(lastAuth, {
                    lastAttempt: now,
                    authorizedAt: now,
                } as AuthSession);
                return lastAuth;
            }

            const session = await authSessionRepo.createOne({
                account: account._id,
                attempt: 1,
                lastAttempt: now,
                authorizedAt: now,
            } as AuthSession);

            return session!;
        }
    })();
};

export default newAccountDomainService;
