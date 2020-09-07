const app =  require("../app");
const request = require("supertest");
require("dotenv").config();

describe("Get author name with valid Token", () => {

    describe("Search for author with valid Token", () => {
        test( "GET/search/?", async () => {
            const res = await request(app)
            .get("/api/v1/search?q=KWAHI")
            .set("Accept", "application/json")
            .set("authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe("GET/search with valid Token", () => {

        test( "GET/search/?", async () => {
            const res = await request(app)
            .get("/api/v1/search?q=KWAHI")
            .set("Accept", "application/json")
            .set("authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
        });
    });
});
