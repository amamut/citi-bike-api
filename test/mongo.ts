import { Collection, MongoClient } from "mongodb";
import { CitiBikeLocationDB } from "../src/shared/collection-types";
import { clients, DB_URI } from "../src/shared/mongo";
import { importLocations } from "./mock/stations.mock";

export function makeCollection<T>(spec: Partial<Collection<T>>): Collection<T> {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        ...(spec as Collection<T>),
    };
}

export function mockMongoCollection() {
    const dbConnectMock = jest.spyOn(MongoClient, "connect");
    dbConnectMock.mockImplementation(() =>
        Promise.resolve({
            db: () => ({
                collection: () => makeCollection<CitiBikeLocationDB>({}),
            }),
        }),
    );
}

export async function setupMongoTest() {
    const client = await clients[DB_URI];
    const collections = await (await client.db("CitiBike").listCollections()).toArray();
    if (collections.find(c => c.name === "testLocations")) {
        await client.db("CitiBike").dropCollection("testLocations");
    }
    const collection = client.db("CitiBike").collection("testLocations");
    importLocations.forEach(async loc => await collection.insertOne(loc));
}
