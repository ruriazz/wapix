import { Manager } from "@vendor";
import { Router } from "express";
import newAccountHandler from "@api/account/handlers";
import { useApiContext } from "@src/utils/api/middleware";
import { authSchema } from "./validator";

const initAccountAPIRoute = (manager: Manager): Router => {
    const handler = newAccountHandler(manager);
    const router = manager.Server.Router();

    router.post("/account/auth", authSchema, useApiContext(handler.auth));
    router.get("/account/profile", useApiContext(handler.profile));

    return router;
};

export default initAccountAPIRoute;
