import { Mongoose } from "mongoose";
import { Express, NextFunction, Router, Request, Response } from "express";

export interface Log {
    info: (data: { message: string; extra?: object | null }) => void;
    warning: (data: {
        message: string;
        error?: Error | unknown;
        extra?: object | null;
    }) => void;
    error: (data: {
        message?: string | null;
        error: Error | unknown;
        extra?: object | null;
    }) => void;
    fatal: (data: {
        message?: string | null;
        error: Error | unknown;
        extra?: object | null;
    }) => void;
    fatalOnError: (data: {
        message?: string | null;
        error?: Error | unknown;
        extra?: object | null;
    }) => void;
}

export interface Settings {
    NODE_NAME: string;
    NODE_ENV: string;
    NODE_TZ: string;
    SECRET_KEY: string;
    BCRYPT_ROUND: number;
    UTC_LOG_TZ: boolean;
    MONGO_DSN: string;
    MONGO_DBNAME: string;
}

export interface Server {
    App: Express;

    Router(): Router;
    runServer(port?: number): void;
}

export interface Databases {
    NoSQL: Mongoose;
}

export interface Manager {
    Log: Log;
    Settings: Settings;
    Databases: Databases;
    Server: Server;
}

export interface ApiContext {
    request: Request;
    response: Response;
    next: NextFunction;
    attribute?: Record<string, any>;
}
