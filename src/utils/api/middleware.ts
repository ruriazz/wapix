import { Request, Response, NextFunction } from "express";
import { ApiContext } from "@vendor";
import { validationResult } from "express-validator";
import { Status, sendJson } from "./response";

type apiContextCallback = (ctx: ApiContext) => void;

enum Auth {
    None,
    Default,
    Restricted,
}

const useApiContext = (func: apiContextCallback, auth?: Auth) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const ctx = { request: req, response: res, next: next, attribute: {} };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendJson(ctx, {
                status: Status.BadRequest,
                message: "Validation Error",
                data: errors.array(),
            });
        }

        func(ctx);
    };
};

export { useApiContext, Auth };
