import supertest from "supertest";
import { server, app, startEmitter } from "../..";
import { mongoDisconnect } from "../../../shared/mongo";
import { setupMongoTest } from "../../../../test/mongo";

describe("stations :: ", () => {
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

    describe("GET /bad-url: ", () => {
        it("should return 404", async () => {
            const res = await request.get("/api/v1/bad-url");
            expect(res.status).toBe(404);
        });
    });

    describe("GET /stations: ", () => {
        it("should get 20 stations", async () => {
            const res = await request.get("/api/v1/stations?limit=20");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(5);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });

        it("should get 3 stations after offset", async () => {
            const res = await request.get("/api/v1/stations?limit=20&offset=2");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.body.limit).toBe(20);
            expect(res.body.offset).toBe(2);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });

        it("should get page 3, 0 stations", async () => {
            const res = await request.get("/api/v1/stations?page=3");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(0);
            expect(res.body.page).toBe(3);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe("GET /stations/in-service: ", () => {
        it("should get all in service stations", async () => {
            const res = await request.get("/api/v1/stations/in-service");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(3);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 1 in service stations", async () => {
            const res = await request.get("/api/v1/stations/in-service?limit=1");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 2 in service stations after offset", async () => {
            const res = await request.get("/api/v1/stations/in-service?limit=10&offset=1");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe("GET /stations/not-in-service: ", () => {
        it("should get all not in service stations", async () => {
            const res = await request.get("/api/v1/stations/not-in-service");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 1 not in service stations", async () => {
            const res = await request.get("/api/v1/stations/not-in-service?limit=1");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 1 not in service stations after offset", async () => {
            const res = await request.get("/api/v1/stations/not-in-service?limit=10&offset=1");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe("GET /stations/:searchstring: ", () => {
        it("should return 2 Broadway stations", async () => {
            const res = await request.get("/api/v1/stations/broadway");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(2);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 1 Franklin station", async () => {
            const res = await request.get("/api/v1/stations/franklin");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
        it("should get 0 Bleeker stations", async () => {
            const res = await request.get("/api/v1/stations/bleeker");
            expect(res.status).toBe(200);
            expect(res.body.data.length).toBe(0);
            expect(res.header).toHaveProperty("content-type");
            expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
        });
    });
});
