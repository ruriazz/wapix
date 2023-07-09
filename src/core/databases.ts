import { type Databases as Interface, type Settings } from '@vendor';
import mongoose from 'mongoose';
import { Redis } from 'ioredis';
import Log from '@core/log';


export default class Databases implements Interface {
    private readonly _settings;
    private readonly _log;

    NoSQL = mongoose;
    Redis = new Redis();


    constructor(settings: Settings) {
        this._settings = settings;
        this._log = new Log(settings);

        this._initMongoose();
        this._initRedis();
    }

    private async _initMongoose() {
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
                message: 'failed connect to mongodb',
                extra: { dsn: this._settings.MONGO_DSN },
                error: err,
            });
        }
    }

    private async _initRedis() {
        const client = new Redis(this._settings.REDIS_STORAGE_URL, {
            maxRetriesPerRequest: 5,
            connectTimeout: 5,
        });

        try {
            await client.ping();
            this.Redis = client;
        } catch (err) {
            this._log.warning({
                message: 'failed connect to redis',
                extra: { dsn: this._settings.REDIS_STORAGE_URL },
                error: err,
            });
        } finally {
            client.disconnect();
        }
    }
}

export { mongoose };

