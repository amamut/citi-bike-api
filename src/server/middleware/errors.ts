import { NextFunction, Request, Response } from "express";
import { logger } from "../config";

class ErrorBase extends Error {
    status = 400;

    constructor(message: string, public params: {}) {
        super(message);
    }
}

export class NotFound extends ErrorBase {
    status = 404;
    constructor(message: string, public params: {}) {
        super(message, params);
    }
}

export class BadRequest extends ErrorBase {
    status = 400;
    constructor(message: string, public params: {}) {
        super(message, params);
    }
}

export function createError(err: ErrorBase | Error, req: Request) {
    if (!(err instanceof ErrorBase)) {
        return new ErrorBase(err.message, req.params);
    }
    return err;
}

export function errorHandler(err: ErrorBase, req: Request, res: Response, next: NextFunction) {
    logger.log("error", err.message, {
        requestParameters: {
            arguments: { ...err.params },
            path: req.route.path,
        },
        timestamp: new Date().toISOString(),
    });
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 400).send({ error: err.message });
}
