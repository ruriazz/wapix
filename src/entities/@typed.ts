import { type Document, type Schema } from 'mongoose';

export type AccountRole = {
    uid?: string;
    slug: string;
    name: string;
    enable: boolean;
    level: number;
} & Document;

export type Account = {
    uid?: string;
    name: string;
    email: string;
    role?: AccountRole;
    password?: string;
    enable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    verifiedAt?: Date;
} & Document;

export type AuthSession = {
    account: Schema.Types.ObjectId;
    attempt: number;
    lastAttempt: Date;
    authorizedAt?: Date;
    authToken?: string;
    refreshToken?: string;
} & Document;
