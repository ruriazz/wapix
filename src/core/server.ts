import express, { Request, Response, NextFunction, Router } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Server as Interface } from "@vendor";
import Log from "@core/log";
import { sendJson, Status } from "@utils/api/response";
import Settings from "@core/settings";
import StackTrace from "stacktrace-js";

export default class Server implements Interface {
    protected _settings: Settings;
    private _log: Log;

    public App = express();

    constructor(settings?: Settings) {
        this._settings = settings || new Settings();
        this._log = new Log(settings);
        this._loadMiddleware();
    }

    private _loadMiddleware() {
        const middlewares = [
            cors({ credentials: true }),
            bodyParser.json(),
            compression(),
            this.responseLogMiddleware,
        ];

        this.App.use(...middlewares);
    }

    public Router(): Router {
        return express.Router();
    }

    public runServer(port?: number) {
        this.App.use(this.exceptionHandler);
        this.App.listen(port || 8080, () => {
            this._log.info({
                message: `server running on http://localhost:${port || 8080}`,
            });
        });
    }

    private responseLogMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        next();
        const log = new Log();
        res.on("finish", () => {
            let extra: any = {};

            if (Object.keys(req.body).length > 0) extra.body = req.body;

            if (Object.keys(req.query).length > 0) extra.query = req.query;

            if (Object.keys(extra).length == 0) extra = null;

            if (
                res.statusCode == StatusCodes.UNAUTHORIZED ||
                (res.statusCode >= StatusCodes.CONTINUE &&
                    res.statusCode <= StatusCodes.MULTI_STATUS)
            ) {
                log.info({
                    message: `> [${res.statusCode}] ${req.method} ${
                        req.path
                    } ${getReasonPhrase(res.statusCode)} <`,
                    extra: extra,
                });
            } else {
                log.warning({
                    message: `> [${res.statusCode}] ${req.method} ${
                        req.path
                    } ${getReasonPhrase(res.statusCode)} <`,
                    extra: extra,
                });
            }
        });
    }

    private async exceptionHandler(
        err: TypeError,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (res.headersSent) {
            return next(err);
        }

        const settings = new Settings();
        const log = new Log(settings);
        const ctx = { request: req, response: res, next: next };

        const st = await StackTrace.fromError(err).then((stackFrames) => {
            return stackFrames.map((stackFrame) => stackFrame.toString());
        });

        let data: any = { errorMessage: err.message, stackTrace: st };
        let status = Status.InternalError;
        if (settings.NODE_ENV != "development") {
            status = Status.BadRequest;
            data = undefined;
        }

        log.error({ error: err });

        sendJson(ctx, {
            status: status,
            data: data,
        });
    }
}
