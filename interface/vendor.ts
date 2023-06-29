import { type Mongoose } from 'mongoose';
import { type Express, type NextFunction, type Router, type Request, type Response } from 'express';
import { type Account } from '@src/entities/@typed';
import { type JwtPayload } from 'jsonwebtoken';

export type Log = {
    info: (data: { message: string; extra?: object | null }) => void;
    warning: (data: { message: string; error?: Error | unknown; extra?: object | null }) => void;
    error: (data: { message?: string | null; error: Error | unknown; extra?: object | null }) => void;
    fatal: (data: { message?: string | null; error: Error | unknown; extra?: object | null }) => void;
    fatalOnError: (data: { message?: string | null; error?: Error | unknown; extra?: object | null }) => void;
};

export type Settings = {
    NODE_NAME: string;
    NODE_ENV: string;
    NODE_TZ: string;
    SECRET_KEY: string;
    UTC_LOG_TZ: boolean;
    MONGO_DSN: string;
    MONGO_DBNAME: string;
    JWT_EXPIRED: number;
    JWT_ISSUER: string;
};

export type Server = {
    App: Express;

    Router: () => Router;
    runServer: (port?: number) => void;
};

export type Databases = {
    NoSQL: Mongoose;
};

export type Manager = {
    Log: Log;
    Settings: Settings;
    Databases: Databases;
    Server: Server;
};

export type AuthData = {
    account: Account;
    encodedToken: string;
    decodedToken: JwtPayload;
};

export type ApiContext = {
    request: Request;
    response: Response;
    next: NextFunction;
    authData?: AuthData;
    attribute?: Record<string, any>;
};