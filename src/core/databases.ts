import { Databases as Interface, Settings } from "@vendor";
import mongoose from "mongoose";
import Log from "@core/log";

export default class Databases implements Interface {
    private _settings;
    private _log;

    NoSQL = mongoose;

    constructor(settings: Settings) {
        this._settings = settings;
        this._log = new Log(settings);

        this._initMongoose();
    }

    private async _initMongoose(c: void) {
        this.NoSQL.Promise = Promise;
        try {
            await this.NoSQL.connect(this._settings.MONGO_DSN, {
                dbName: this._settings.MONGO_DBNAME,
            });

            this.NoSQL.connection.useDb(this._settings.MONGO_DBNAME, {
                useCache: true,
            });
        } catch (err) {
            this._log.warning({
                message: "failed connect to mongodb",
                extra: { dsn: this._settings.MONGO_DSN },
                error: err,
            });
        }
    }
}

export { mongoose };
