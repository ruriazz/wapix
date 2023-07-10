import { Log, Manager, WhatsappClient } from '@vendor';
import { blake2Encode } from '@helpers/hash';
import WAWebJS, { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import Databases from '@core/databases';

const SETTINGS = {
    authDataPath: '.whatsapp/auth',
    localCachePath: '.whatsapp/cache',
    remoteAuthDb: 'whatsapp_client',
};

type onQRStringReceive = (value: string) => void;

export default class Whatsapp {
    private manager: Manager;
    private log: Log;

    constructor(manager: Manager) {
        this.manager = manager;
        this.log = manager.Log;
    }

    private async authStore(): Promise<WAWebJS.Store> {
        const nosql = await Databases.beginNosql(this.manager.Settings.MONGO_DSN, SETTINGS.remoteAuthDb);
        const store = new MongoStore({ mongoose: nosql }) as WAWebJS.Store;
        return store;
    }

    private async remoteAuth(clientId: string): Promise<WAWebJS.RemoteAuth> {
        const remoteAuth = new RemoteAuth({
            clientId: clientId,
            store: await this.authStore(),
            backupSyncIntervalMs: 300000,
            dataPath: SETTINGS.authDataPath,
        });

        return remoteAuth;
    }

    public async getClient(phoneNumber: string): Promise<WhatsappClient> {
        const clientId = blake2Encode(phoneNumber, 8);

        const client = new Client({
            authStrategy: await this.remoteAuth(clientId),
            puppeteer: {
                args: ['--no-sandbox'],
            },
            webVersionCache: { type: 'local', path: SETTINGS.localCachePath, strict: false } as WAWebJS.WebCacheOptions,
        });

        return Promise.resolve({ id: clientId, phone: phoneNumber, instance: client });
    }

    public async listenAuth(client: WhatsappClient, onQrReceive: onQRStringReceive): Promise<void> {
        const log = this.log;
        const _client = client.instance;
        const authStore = await this.authStore();
        let onAuthenticated = false;
        let authenticated = false;

        try {
            await _client.resetState();
        } catch (error) {}

        ['qr', 'authenticated', 'ready'].forEach((event) => _client.removeAllListeners(event));

        _client.on('qr', (value: string) => onQrReceive(value));

        _client.on('authenticated', async (_: string) => {
            onAuthenticated = true;
            authenticated = true;
        });

        _client.on('ready', async () => {
            if (onAuthenticated) {
                const user = _client.info.me.user;
                if (user != client.phone) {
                    log.warning({ message: `user '${user}' is not match with client '${client.phone}'` });

                    await this.logout(client);
                    authenticated = false;
                }

                _client.on('remote_session_saved', async () => {
                    if (!authenticated) {
                        console.log('hapus nih');
                        const deleted = await authStore.delete({ session: client.id });
                        console.log('kehapus?', deleted);
                    }

                    // TODO: post webhook auth data is saved
                    log.info({ message: 'remote session saved', extra: { phoneNumber: user } });
                });
            }
            log.info({ message: `client ${_client.info.me.user} ready` });
        });

        _client.initialize();
    }

    public async logout(client: WhatsappClient): Promise<void> {
        const auth = await this.remoteAuth(client.id);
        await client.instance.logout();
        await client.instance.destroy();
        await auth.logout();
        await auth.destroy();
        await auth.disconnect();
    }

    public async initializeClient(client: WhatsappClient, defaultListener: boolean = true) {
        if (defaultListener) {
            this.initializeListener(client);
        }

        try {
            await client.instance.initialize();
        } catch (err) {
            console.log('error:', err);
        }

        return client;
    }

    private initializeListener(client: WhatsappClient) {}
}
