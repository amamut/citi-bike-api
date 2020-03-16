import winston from "winston";

export const DEBUG = process.env.DEBUG === "1" || (process.env.DEBUG || "").toLowerCase() === "true";
export const LOG_LEVEL = DEBUG ? "debug" : process.env.LOG_LEVEL || "info";
export const ENV = process.env.ENV ? process.env.ENV : "prod";
export const CACHE = process.env.CACHE ? Boolean(process.env.CACHE) : ENV === "dev" ? false : true;
export const PORT = process.env.PORT ? process.env.PORT : 4000;
export const DB_COLLECTION = process.env.DB_COLLECTION ? process.env.DB_COLLECTION : "locations";
export const REDIS_HOST = process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost";
export const CACHE_TTL = process.env.CACHE_TTL ? process.env.CACHE_TTL : "10";

export const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(winston.format.colorize(), winston.format.splat(), winston.format.simple()),
    transports: [new winston.transports.Console()],
});
