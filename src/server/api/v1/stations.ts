import { Request, Response, NextFunction } from "express";
import { getCursor, stationWrapper } from "./helpers/query";
import { createError } from "../../middleware/errors";

export type ServiceType = "in-service" | "out-of-service" | "search" | "all";

export class Stations {
    static async getStations(req: Request, res: Response, next: NextFunction) {
        try {
            const cursor = await getCursor(req, "all");
            return stationWrapper(req, res, cursor);
        } catch (err) {
            next(createError(err, req));
        }
    }

    static async getInServiceStations(req: Request, res: Response, next: NextFunction) {
        try {
            const cursor = await getCursor(req, "in-service");
            return stationWrapper(req, res, cursor);
        } catch (err) {
            next(createError(err, req));
        }
    }

    static async getOutOfServiceStations(req: Request, res: Response, next: NextFunction) {
        try {
            const cursor = await getCursor(req, "out-of-service");
            return stationWrapper(req, res, cursor);
        } catch (err) {
            next(createError(err, req));
        }
    }

    static async searchStations(req: Request, res: Response, next: NextFunction) {
        try {
            const cursor = await getCursor(req, "search");
            return stationWrapper(req, res, cursor);
        } catch (err) {
            next(createError(err, req));
        }
    }
}
