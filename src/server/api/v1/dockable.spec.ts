import supertest from "supertest";
import { server, app, startEmitter } from "../..";
import { mongoDisconnect } from "../../../shared/mongo";
import { setupMongoTest } from "../../../../test/mongo";

describe("dockable :: ", () => {
    const request = supertest(app);

    beforeAll(done => {
        startEmitter.on("started", async started => {
            await setupMongoTest();
            done();
        });
    });

    afterAll(async done => {
        await mongoDisconnect();
        server.close(done);
    });

    describe("GET /dockable/:locationid/:bikestoreturn : ", () => {
        it("station not found", async () => {
            const res = await request.get("/api/v1/dockable/1231213/40");
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("station not found");
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });

        it("should be successful return", async () => {
            const res = await request.get("/api/v1/dockable/79/2");
            expect(res.status).toBe(200);
            expect(res.body.data.dockable).toBe(true);
            expect(res.body.data.message).toBe(
                "This station has enough available docks for you to return all your bikes",
            );
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });

        it("should be unsuccessful return", async () => {
            const res = await request.get("/api/v1/dockable/79/7");
            expect(res.status).toBe(200);
            expect(res.body.data.dockable).toBe(false);
            expect(res.body.data.message).toBe("This station doesn't have enough available docks for all your bikes");
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
    });
});
