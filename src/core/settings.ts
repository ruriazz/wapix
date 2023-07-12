import dotenv from 'dotenv';
import { type Settings as Interface } from '@vendor';

dotenv.config();
export default class Settings implements Interface {
    NODE_NAME: string = process.env.NODE_NAME || 'wapix';
    NODE_ENV: string = process.env.NODE_ENV || 'development';
    NODE_TZ: string = process.env.NODE_TZ || 'UTC';
    NODE_ADDRESS: string = process.env.NODE_ADDRESS || 'http://127.0.0.1:8080';
    SECRET_KEY: string = process.env.SECRET_KEY || 'NodeSecretKey__';
    INTERNAL_HOOK_USER: string = process.env.INTERNAL_HOOK_USER || 'internal';
    INTERNAL_HOOK_SECRET: string = process.env.INTERNAL_HOOK_SECRET || 'hookSecret';
    UTC_LOG_TZ: boolean = (process.env.UTC_LOG_TZ || 'false') == 'true';
    MONGO_DSN: string = process.env.MONGO_DSN || '';
    REDIS_STORAGE_URL: string = process.env.REDIS_STORAGE_URL || '';
    MONGO_DBNAME: string = process.env.MONGO_DBNAME || '';
    JWT_EXPIRED: number = parseInt(process.env.JWT_EXPIRED || '900');
    JWT_ISSUER: string = process.env.JWT_ISSUER || '';

    constructor() {}
}
