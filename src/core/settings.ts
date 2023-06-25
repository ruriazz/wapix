import dotenv from "dotenv";
import { Settings as Interface } from "@vendor";

dotenv.config();
export default class Settings implements Interface {
    NODE_NAME: string = process.env.NODE_NAME || "wapix";
    NODE_ENV: string = process.env.NODE_ENV || "development";
    NODE_TZ: string = process.env.NODE_TZ || "UTC";
    SECRET_KEY: string = process.env.SECRET_KEY || "NodeSecretKey__";
    BCRYPT_ROUND: number = parseInt(process.env.BCRYPT_ROUND || "14");
    UTC_LOG_TZ: boolean = (process.env.UTC_LOG_TZ || "false") == "true";
    MONGO_DSN: string = process.env.MONGO_DSN || "";
    MONGO_DBNAME: string = process.env.MONGO_DBNAME || "";

    constructor() { }
}
