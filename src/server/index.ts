import { logger, DEBUG, ENV, LOG_LEVEL, PORT, DB_COLLECTION, USE_CACHE, CACHE_TTL } from "./config";
import { DB_URI, mongoConnect, mongoDisconnect } from "../shared/mongo";
import express from "express";
import { errorHandler } from "./middleware/errors";
import { v1api } from "./api/v1";
import { Server } from "http";
import { EventEmitter } from "events";
import { redisConnect } from "../shared/redis";
import { cacheHandler } from "./middleware/cache";

// tslint:disable-next-line:no-var-requires
require("source-map-support").install();

const bodyParser = require("body-parser");
const morgan = require("morgan");

export const app = express();
app.use(cacheHandler);
export const startEmitter = new EventEmitter();
export let server = new Server();

const main = async () => {
    logger.info(`DEBUG                      ${DEBUG}`);
    logger.info(`ENV:                       ${ENV}`);
    logger.info(`LOG_LEVEL:                 ${LOG_LEVEL}`);
    logger.info(`DB_URI:                    ${DB_URI}`);
    logger.info(`DB_COLLECTION:             ${DB_COLLECTION}`);
    logger.info(`USE_CACHE:                 ${USE_CACHE}`);
    logger.info(`CACHE_TTL:                 ${CACHE_TTL}`);

    await mongoConnect();
    await redisConnect();

    app.use(morgan("tiny"));

    app.use("/api/v1", v1api);
    app.use(bodyParser.json());
    app.use(errorHandler);
    // start the Express server
    server = app.listen(PORT, () => {
        logger.info(`🚀 Server ready at http://localhost:${PORT}`);
        startEmitter.emit("started", true);
    });
};

main().catch(async e => {
    logger.error(e);
    await mongoDisconnect();
    process.exit(1);
});
