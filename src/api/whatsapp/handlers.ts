import { ApiContext, Manager } from "@src/@vendor";
import { Handlers } from "@api/whatsapp/domain/@interface";
import { authenticatedHandler } from '@decorators/authentication';
import { Status, sendJson } from '@utils/api/response';
import { Namespace, Socket } from "socket.io";

const newWhatsappHandler = (manager: Manager): Handlers => {
    return new (class implements Handlers {
        @authenticatedHandler(manager, true)
        async getRegistrationLink(ctx: ApiContext): Promise<void> {
            sendJson(ctx);
        }

        async wsPatchSession(io: Namespace): Promise<void> {
            io.on('connection', (socket: Socket) => {
                console.log('new connection', socket.id);
            })
        }
    });
};

export default newWhatsappHandler;