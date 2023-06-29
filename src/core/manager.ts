import { type Manager as Interface, type Server as _Server } from '@vendor';
import Settings from '@core/settings';
import Log from '@core/log';
import Server from '@core/server';
import Databases from '@core/databases';
import loadSeeds from './seeds/loader';

export default class Manager implements Interface {
    Settings: Settings = new Settings();
    Log: Log = new Log(this.Settings);

    Databases: Databases;
    Server: _Server;

    constructor() {
        this.Log.info({ message: 'Starting manager..' });

        this.Databases = new Databases(this.Settings);
        this.Server = new Server(this.Settings);
        this._manageAll().then(() => {
            this.Log.info({ message: 'Manager ready.' });
        });
    }

    private async _manageAll() {
        // Load seed data
        loadSeeds();
    }
}
