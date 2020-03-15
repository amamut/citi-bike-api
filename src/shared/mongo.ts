import { MongoClient, Collection } from "mongodb";
import { CitiBikeLocationDB } from "./collection-types";
import { logger, DB_COLLECTION } from "../server/config";

export const clients: { [x: string]: Promise<MongoClient> } = {};
export const DB_URI = process.env.DB_URI || "mongodb://root:example@localhost";
export let locationCollection: Collection<CitiBikeLocationDB>;

function connectDb(uri: string) {
    if (!uri) {
        throw new Error("A URI is required to init a mongo client.");
    }
    if (!clients[uri]) {
        clients[uri] = MongoClient.connect(uri, { useNewUrlParser: true, connectTimeoutMS: 5000 });
    }
    return clients[uri];
}

async function disconnectDB(uri: string) {
    if (clients[uri]) {
        (await clients[uri]).close();
    }
}

export function mongoDisconnect() {
    return disconnectDB(DB_URI);
}

export async function mongoConnect() {
    let client: MongoClient;
    try {
        logger.info(`Connecting to DB - ${DB_URI}`);
        client = await connectDb(DB_URI);
        logger.info("Connected to DB");
    } catch (err) {
        logger.error("error connecting to mongo");
        throw err;
    }
    locationCollection = client.db("CitiBike").collection<CitiBikeLocationDB>(DB_COLLECTION);
}

function collectionWrapper(name: string) {
    if (!clients[DB_URI]) {
        throw new Error("not connected to DB");
    }
    if (name === "locations") {
        throw new Error("name can't be same as live collection");
    }
    return clients[DB_URI];
}

export async function createTmpCollection(name: string) {
    const client = await collectionWrapper(name);
    if ((await (await client.db("CitiBike").listCollections()).toArray()).includes(name)) {
        client.db("CitiBike").dropCollection(name);
    }
    return client.db("CitiBike").createCollection<CitiBikeLocationDB>(name);
}

export async function swapCollectionNames(name: string) {
    const client = await collectionWrapper(name);
    if ((await (await client.db("CitiBike").listCollections()).toArray()).includes("locations")) {
        client.db("CitiBike").dropCollection("locations");
    }
    client.db("CitiBike").renameCollection(name, "locations");
}
