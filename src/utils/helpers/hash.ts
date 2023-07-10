import Settings from '@core/settings';
import { staticSettings } from '@const';
import { Account, AuthSession } from '@src/entities/@typed';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { blake2b, blake2bHex } from 'blakejs';

const settings = new Settings();

const makePassword = async (plainText: string, round?: number): Promise<string> => {
    const hash = await bcrypt.hash(plainText, round || staticSettings.PASSWORD_BCRYPTY_ROUND);
    return hash;
};

const verifyPassword = async (hash: string, plainText: string): Promise<boolean> => {
    const result = await bcrypt.compare(plainText, hash);
    return result;
};

const createJwt = async (account: Account, session: AuthSession) => {
    let jwtIssuer = staticSettings.JWT_AUDIENCE;
    if (settings.JWT_ISSUER != '') {
        jwtIssuer = settings.JWT_ISSUER;
    }

    const token = jwt.sign(
        {
            account: sha256Encrypt(account.uid!),
            session: session._id.toString(),
        },
        btoa(settings.SECRET_KEY),
        {
            expiresIn: settings.JWT_EXPIRED,
            algorithm: staticSettings.JWT_ALGORITHM,
            audience: staticSettings.JWT_AUDIENCE,
            issuer: jwtIssuer,
            keyid: session._id.toString(),
        }
    );
    return token;
};

const parseJwt = (token: string, allowExpired = true): JwtPayload | undefined => {
    let jwtIssuer = staticSettings.JWT_AUDIENCE;
    if (settings.JWT_ISSUER != '') {
        jwtIssuer = settings.JWT_ISSUER;
    }

    try {
        const decoded: JwtPayload = jwt.verify(token, btoa(settings.SECRET_KEY), {
            ignoreExpiration: allowExpired,
            algorithms: [staticSettings.JWT_ALGORITHM],
            audience: staticSettings.JWT_AUDIENCE,
            issuer: jwtIssuer,
        }) as JwtPayload;
        return decoded;
    } catch (error) {}
};

const sha512Encrypt = (data: string): string => {
    const hash = crypto.createHash('sha512');
    hash.update(data);
    return hash.digest('hex');
};

const sha512Verify = (data: string, encrypted: string): boolean => {
    const hash = crypto.createHash('sha512');
    hash.update(data);
    const hashedData = hash.digest('hex');
    return hashedData === encrypted;
};

const sha256Encrypt = (data: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
};

const sha256Verify = (data: string, encrypted: string): boolean => {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const hashedData = hash.digest('hex');
    return hashedData === encrypted;
};

const createToken = (length = 8): string => {
    const buffer = crypto.randomBytes(Math.ceil(length / 2));
    const token = buffer.toString('hex').slice(0, length);
    return token;
};

const blake2Encode = (text: string, outlen: number = 8) => {
    const hash = blake2bHex(text, undefined, outlen);
    return hash;
};

export { makePassword, verifyPassword, createJwt, parseJwt, sha512Encrypt, sha512Verify, sha256Encrypt, sha256Verify, createToken, blake2Encode };
