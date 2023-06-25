import { Document } from "mongoose";
import { mongoose } from "@core/databases";

export interface AccountRole extends Document {
    uid?: string,
    slug: string,
    name: string,
    enable: boolean,
    level: number,
}

export interface Account extends Document {
    uid?: string,
    name: string,
    email: string,
    role?: mongoose.Model<AccountRole>,
    password?: string,
    enable?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    verifiedAt?: Date,
}