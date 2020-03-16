import { Request, Response, NextFunction } from "express";
import { cacheGet } from "../../shared/redis";

export async function cacheHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await cacheGet(req.url);
        if (result && typeof result === "object") {
            res.status(Number(result.status)).send(result.body);
            return;
        }
    } catch (err) {
        next();
    }
}
