import { Log, Manager, WhatsappClient } from '@vendor';
import Databases from '@core/databases';
import { blake2Encode, createBasicAuth } from '@helpers/hash';
import { WawebEvent } from '@utils/waweb/wawebEvent';
import WAWebJS, { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import axios from 'axios';
import { staticSettings } from '@src/const';

type onQrReceived = (value: string) => void;
type onAuthSuccess = (err: Error | undefined) => void;

export default class Whatsapp {
    private manager: Manager;
    private log: Log;

    constructor(manager: Manager) {
        this.manager = manager;
        this.log = manager.Log;
    }

    private async authStore(): Promise<WAWebJS.Store> {
        const nosql = await Databases.beginNosql(this.manager.Settings.MONGO_DSN, staticSettings.WAWEB_REMOTEAUTH_DB);
        const store = new MongoStore({ mongoose: nosql }) as WAWebJS.Store;
        return store;
    }

    private async remoteAuth(clientId: string): Promise<WAWebJS.RemoteAuth> {
        const remoteAuth = new RemoteAuth({
            clientId: clientId,
            store: await this.authStore(),
            backupSyncIntervalMs: 300000,
            dataPath: staticSettings.WAWEB_AUTHDATA_PATH,
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
            webVersionCache: {
                type: staticSettings.WAWEB_WEB_CACHE_TYPE,
                path: staticSettings.WAWEB_LOCAL_CACHE_PATH,
                strict: false,
            } as WAWebJS.WebCacheOptions,
        });

        return Promise.resolve({ id: clientId, phone: phoneNumber, instance: client });
    }

    public async listenAuth(client: WhatsappClient, onQrReceive: onQrReceived, onAuthSuccess: onAuthSuccess): Promise<void> {
        const log = this.log;
        const settings = this.manager.Settings;
        const _client = client.instance;
        const authStore = await this.authStore();
        let onAuthenticated = false;
        let authenticated = true;

        try {
            await _client.pupPage?.waitForNavigation();
            await _client.resetState();
        } catch (error) {}

        [WawebEvent.QRReceived, WawebEvent.Authenticated, WawebEvent.Ready].forEach((event) => _client.removeAllListeners(event));

        _client.on(WawebEvent.QRReceived, (value: string) => onQrReceive(value));

        _client.on(WawebEvent.Authenticated, async (_: string) => {
            onAuthenticated = true;
            authenticated = true;
        });

        _client.on(WawebEvent.Ready, async () => {
            if (onAuthenticated) {
                const user = _client.info.me.user;
                if (user != client.phone) {
                    const message = `user '${user}' is not match with client '${client.phone}'`;
                    log.warning({ message: message });

                    await this.logout(client);
                    authenticated = false;
                    onAuthSuccess(new Error(message));
                }

                _client.on(WawebEvent.RemoteSessionSaved, async () => {
                    if (!authenticated) {
                        return await this.logout(client);
                    }

                    // TODO: [Webhook][POST] update whatsapp client authorized status
                    await axios({
                        method: 'post',
                        url: `${settings.NODE_ADDRESS}/hook/whatsapp/client`,
                        data: { number: client.phone, auth: `whatsapp-RemoteAuth-${client.id}` },
                        headers: { Authorization: await createBasicAuth(settings.INTERNAL_HOOK_USER, settings.INTERNAL_HOOK_SECRET, true) },
                        validateStatus: (status) => status < 500,
                    });

                    log.info({ message: 'remote session saved', extra: { phoneNumber: user } });
                    await _client.destroy();
                });
            }

            if (authenticated) {
                onAuthSuccess(undefined);
                log.info({ message: `client ${_client.info.me.user} ready` });
            }
        });

        try {
            await _client.initialize();
        } catch (error) {
            this.listenAuth(client, onQrReceive, onAuthSuccess);
        }
    }

    public async destroyClient(client: WhatsappClient): Promise<void> {
        try {
            await client.instance.destroy();
        } catch (error) {}
    }

    public async logout(client: WhatsappClient): Promise<void> {
        const auth = await this.remoteAuth(client.id);
        await client.instance.logout();
        await auth.logout();
        await auth.destroy();
        await client.instance.destroy();
    }

    public async initializeClient(client: WhatsappClient, defaultListener: boolean = true) {
        if (defaultListener) {
            this.initializeListener(client);
        }

        try {
            await client.instance.initialize();
        } catch (err) {}

        return client;
    }

    private initializeListener(client: WhatsappClient) {}
}
