import { logger } from "../server/config";
import { mongoConnect, createTmpCollection, swapCollectionNames } from "../shared/mongo";
import Axios from "axios";
import { CitiBikeLocationResponse, createDBLocation, CitiBikeLocationDB } from "../shared/collection-types";

const LOCATIONS_URL = "https://feeds.citibikenyc.com/stations/stations.json";

async function main() {
    const tmpCollectionName = "CitiBikeLocationTmp";
    try {
        await mongoConnect();
        const tmpCollection = await createTmpCollection(tmpCollectionName);
        logger.debug(`Fetching from ${LOCATIONS_URL}`);
        const locationResponse = await Axios.get<CitiBikeLocationResponse>(LOCATIONS_URL, { timeout: 10000 });

        const bulkInsertCmds: any = [];
        locationResponse.data.stationBeanList.forEach(station => {
            bulkInsertCmds.push({ insertOne: { document: createDBLocation(station) } });
        });
        const {
            insertedCount,
            result: { writeErrors, ok },
        } = await tmpCollection.bulkWrite(bulkInsertCmds);
        logger.info(`Success: ${Boolean(ok)}, Inserted: ${insertedCount}, Errors: ${JSON.stringify(writeErrors)}`);
        await swapCollectionNames(tmpCollectionName);
        logger.info("Import completed");
        process.exit(0);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

main().catch(e => {
    logger.error(e);
    process.exit(1);
});
