import { RedisClient } from "redis";
import { REDIS_HOST, logger, CACHE, CACHE_TTL } from "../server/config";

export const cacheableStatusCodes: { [key: number]: boolean } = {
    200: true,
    302: true,
    404: true,
};

export let redisClient: RedisClient;

export function redisConnect() {
    if (CACHE === true) {
        redisClient = new RedisClient({
            host: REDIS_HOST,
            port: 6379,
        });
        logger.info("Connected to redis");
    }
}

export function cacheSet(key: string, body: any, statusCode: number) {
    if (CACHE === true) {
        try {
            if (cacheableStatusCodes[statusCode]) {
                redisClient.hmset(
                    Buffer.from(key).toString("base64"),
                    "body",
                    JSON.stringify(body),
                    "status",
                    statusCode,
                    () => redisClient.expire(Buffer.from(key).toString("base64"), Number(CACHE_TTL)),
                );
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export function cacheGet(key: string): Promise<{ body: object; status: string }> {
    return new Promise((resolve, reject) => {
        if (CACHE === true) {
            redisClient.hmget(Buffer.from(key).toString("base64"), "body", "status", (err, fields) => {
                if (!err && fields[0] && fields[1]) {
                    resolve({ body: JSON.parse(fields[0]), status: fields[1] });
                }
                reject(false);
            });
        } else {
            reject(false);
        }
    });
}
