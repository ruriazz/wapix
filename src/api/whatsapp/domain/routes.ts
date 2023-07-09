import { Router } from "express";
import { Manager } from "@src/@vendor";
import newWhatsappHandler from "@api/whatsapp/handlers";
import { useApiContext } from "@utils/api/middleware";

const initWhatsappAPIRoute = (manager: Manager): Router => {
    const handler = newWhatsappHandler(manager);
    const router = manager.Server.Router();

    router.post('/whatsapp/session', useApiContext(handler.getRegistrationLink));

    return router;
};

const initWhatsappSocketNamespace = (manager: Manager) => {
    const handler = newWhatsappHandler(manager);

    handler.wsPatchSession(manager.Server.Socket!.of('/patch/whatsapp/session'));
};

export { initWhatsappAPIRoute, initWhatsappSocketNamespace };