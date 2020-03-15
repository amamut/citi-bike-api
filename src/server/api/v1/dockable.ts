import { Request, Response, NextFunction } from "express";
import { getStationById } from "./helpers/query";
import { BadRequest, NotFound, createError } from "../../middleware/errors";
import { DockableResponse } from "../../../shared/collection-types";

function dockableResponse(isDockable: boolean) {
    switch (isDockable) {
        case true:
            return "This station has enough available docks for you to return all your bikes";
        case false:
            return "This station doesn't have enough available docks for all your bikes";
    }
}

export class Dockable {
    static async returnBikes(req: Request, res: Response, next: NextFunction) {
        try {
            const bikesToReturn = Number(req.params.bikestoreturn);
            if (!bikesToReturn) {
                throw new BadRequest("number of bikes returning was not set", req);
            }
            const station = await getStationById(req);
            if (!station) {
                throw new NotFound("station not found", req);
            }
            const isDockable = bikesToReturn <= station.availableDocks;
            const response: DockableResponse = {
                data: {
                    dockable: isDockable,
                    message: dockableResponse(isDockable),
                },
                stationId: Number(req.params.stationid),
                bikesToReturn,
            };
            res.status(200).send(response);
        } catch (err) {
            next(createError(err, req));
        }
    }
}
