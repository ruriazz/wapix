import { type Request, type Response, type NextFunction } from 'express';
import { type ApiContext } from '@vendor';
import { validationResult } from 'express-validator';
import { Status, sendJson } from './response';

type apiContextCallback = (ctx: ApiContext) => void;

const useApiContext = (func: apiContextCallback) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const ctx = { request: req, response: res, next, attribute: {} };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            sendJson(ctx, {
                status: Status.BadRequest,
                message: 'Validation Error',
                data: errors.array(),
            });
            return;
        }

        func(ctx);
    };
};

export { useApiContext };
