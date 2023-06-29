import { type Algorithm } from 'jsonwebtoken';

const accountRoleSlug = {
    MASTER: 'master',
    ADMIN: 'admin',
};

const defaultMessage = {
    AUTH_ERROR_INFO: 'Invalid email or password',
    AUTH_MANY_TRIES: 'Too many login attempts',
    AUTH_TOKEN_NOT_FOUND: 'No authorization data',
    AUTH_ERROR_SIGNATURE: 'Invalid account signature',
    AUTH_INACTIVE_ACCOUNT: 'Account has been deactivated',
    AUTH_TOKEN_VALIDATION_ERROR: 'Token expired or invalid signature',
};

const staticSettings = {
    PASSWORD_BCRYPTY_ROUND: 14,
    AUTH_ATTEMPT_LIMIT: 3,
    INVALID_AUTH_TIMEOUT: 300,
    JWT_ALGORITHM: 'HS512' as Algorithm,
    JWT_AUDIENCE: 'ruriazz.com',
    JWT_BCRYPT_ROUND: 6,
    REFRESH_TOKEN_LENGTH: 56,
};

export { accountRoleSlug, defaultMessage, staticSettings };
