import { Request, Response } from "express";
import { ServiceType } from "../stations";
import { locationCollection } from "../../../../shared/mongo";
import { Cursor } from "mongodb";
import {
    CitiBikeLocationDB,
    createAPILocation,
    StationResponse,
    CitiBikeLocationItem,
} from "../../../../shared/collection-types";
import { escapeRegex } from "./regex";
import { BadRequest } from "../../../middleware/errors";

export const DEFAULT_LIMIT = 20;

function generateQuery(req: Request, type: ServiceType) {
    switch (type) {
        case "in-service":
            return { statusValue: "In Service" };
        case "out-of-service":
            return { statusValue: "Not In Service" };
        case "search":
            const search = getFuzzySearchRegex(req);
            return {
                $or: [
                    {
                        stationName: search,
                    },
                    {
                        stAddress1: search,
                    },
                ],
            };
        default:
            return {};
    }
}

export function getCursor(req: Request, type: ServiceType) {
    const query = generateQuery(req, type);
    if (req.query.offset || req.query.limit) {
        return locationCollection
            .find(query)
            .skip(Number(req.query.offset) || 0)
            .limit(Number(req.query.limit) || DEFAULT_LIMIT);
    } else if (req.query.page) {
        const offset = DEFAULT_LIMIT * (Number(req.query.page) - 1);
        return locationCollection
            .find(query)
            .skip(offset)
            .limit(DEFAULT_LIMIT);
    } else {
        return locationCollection.find(query);
    }
}

export async function stationWrapper(req: Request, res: Response, cursor: Cursor<CitiBikeLocationDB>) {
    const items = (await cursor.toArray()).map(loc => createAPILocation(loc));
    const data: StationResponse<CitiBikeLocationItem> = {
        data: items,
        ...(req.query.page && { page: Number(req.query.page) }),
        ...((req.query.offset || req.query.limit) && {
            offset: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || DEFAULT_LIMIT,
        }),
    };
    res.status(200).send(data);
}

function getFuzzySearchRegex(req: Request) {
    if (!req || !req.params.searchstring) {
        throw new BadRequest("searchstring not provided to search endpoint", req.params);
    }
    const searchString = req.params.searchstring;
    return new RegExp(escapeRegex(searchString), "gi");
}

export function getStationById(req: Request) {
    if (!req.params.stationid) {
        throw new BadRequest("id not provided", req.params);
    }
    return locationCollection.findOne({ id: Number(req.params.stationid) });
}
