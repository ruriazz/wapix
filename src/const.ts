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
    WA_ENROLL_SESSION_ERROR: 'Enroll session invalid',
    WA_AUTHORIZED_CLIENT: 'Client is authorized',
};

const staticSettings = {
    PASSWORD_BCRYPTY_ROUND: 14,
    AUTH_ATTEMPT_LIMIT: 3,
    INVALID_AUTH_TIMEOUT: 300,
    JWT_ALGORITHM: 'HS512' as Algorithm,
    JWT_AUDIENCE: 'ruriazz.com',
    JWT_BCRYPT_ROUND: 6,
    REFRESH_TOKEN_LENGTH: 56,
    WAWEB_AUTHDATA_PATH: '.whatsapp/auth',
    WAWEB_WEB_CACHE_TYPE: 'local',
    WAWEB_LOCAL_CACHE_PATH: '.whatsapp/cache',
    WAWEB_REMOTEAUTH_DB: 'whatsapp_client',
};

const staticErrorMessage = {
    BROWSER_NAVIGATION_DISCONNECT: 'Navigation failed because browser has disconnected!',
    BROWSER_PROTOCOL_ERROR: 'Protocol error (Runtime.callFunctionOn): Target closed.',
};

const whatsappClientStatus = {
    UNAUTHORIZED: 'unauthorized',
    PENDING: 'pending',
    OFFLINE: 'offline',
    ONLINE: 'online',
};

export { accountRoleSlug, defaultMessage, staticSettings, staticErrorMessage, whatsappClientStatus };
