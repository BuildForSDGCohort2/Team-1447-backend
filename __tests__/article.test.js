const app = require("../src/app")
const request = require("supertest");
const fs = require("fs");
require("dotenv").config();

describe("Article ctrl", () => {
    describe( "get all article with correct Token", () => {
        test( "author should be able to view all article written", async () => {

        const res = await request(app)
        .get("/api/v1/articles")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN)
        expect(res.statusCode).toBe(200);
        });
    });

    describe( "get all article with Incorrect Token", () => {

        test( "author should be able to view all article written", async () => {

        const res = await request(app)
        .get("/api/v1/articles")
        .set("content-type", "application/json")
        .set("authorization", process.env.FK_TOKEN)
        expect(res.statusCode).not.toBe(200);
        });
    });

    describe( "post an article with correct Token", () => {
        // this article controller should deal with handling of image
        const article= {
            articleTitle: "This is Africa",
            articleBody: "This why tech should be in Africa",
            dateOfPub: "2017-04-03",
            authorId: 25
        };

        test( "author should be able to post an article",  async () => {
            const res = await request(app)
            .post("/api/v1/create/article")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            .send(article)
            expect(res.statusCode).toBe(201)
            // expect(res.body.status).haveProperty("status");
        });
    });

    describe( "post an article with an incorrect Token", () => {
        // this article controller should deal with handling of image
        const article= {
            articleTitle: "This is Africa",
            articleBody: "This why tech should be in Africa",
            dateOfPub: "2017-04-03",
            authorId: 25
        }

        test( "POST /article",  async () => {
            const res = await request(app)
            .post("/api/v1/create/article")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            .send(article)
            expect(res.statusCode).not.toBe(201)
            // expect(res.body.status).haveProperty("status");
        });
    });

    describe( "get a specific article with correct Token" , () => {
        test( "GET /articles/:articleId" , async () => {
            const res = await request(app)
            .get("/api/v1/articles/46")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            expect(res.statusCode).toBe(200)
        });
    });

    describe( "get a specific article with an Incorrect Token" ,() => {
        test( "POST /articles/:articleId", async () => {
            const res = await request(app)
            .get("/api/v1/articles/45")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            expect(res.statusCode).not.toBe(200)
        });
    });

    describe("edit a specific article with correct Token", () => {
        test("PATCH /article/edit/:articleId", async () => {

            const article = {
                articleTitle: "Corruption is a panacea for under development",
                articleBody: "Corruption is not Stealing said a former president of the Federal Republic of Nigeria",
                dateOfPub: "2017-04-03",
                authorId: 25   
            }

            const res = await request(app)
            .patch("/api/v1/article/edit/48")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            .send(article)
            expect(res.statusCode).toBe(201)
        });
    });

    describe( "edit a specific article with Incorrect Token", () => {
        test( "PATCH /article/edit/:articleId", async () => {

            const article = {
                articleTitle: "Corruption is a panacea for under development",
                articleBody: "Corruption is not Stealing said a former president of the Federal Republic of Nigeria",
                dateOfPub: "2017-04-03",
                authorId: 25
            };

            const res = await request(app)
            .patch("/api/v1/article/edit/43")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            .send(article)
            expect(res.statusCode).not.toBe(201)
        });
    });

    describe( "delete a specific article and media associated to the author with correct Token", () => {
        test( "DELETE /articles/delete/:articleId", async () => {
            const res = await request(app)
            .delete("/api/v1/articles/delete/42")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            expect(res.statusCode).toBe(200);
        });
    });

    describe( "delete an article and media associated to the author with Incorrect Token" , () => {
        test("DELETE /api/v1/delete/articles/:articleId", async () => {
            const res = await request(app)
            .delete("/api/v1/articles/delete/42")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            expect(res.statusCode).not.toBe(200);
        });
    });

    describe( "delete all article and media associated to the author with correct Token", () => {

        test( "DELETE /article/", async () => {
            const res = await request(app)
            .delete("/api/v1/delete/articles/")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            expect(res.statusCode).toBe(200);
        });
    });

    describe( "delete all article and media associated to the author with Incorrect Token", () => {
        test( "DELETE /article/", async () => {
            const res = await request(app)
            .delete("/api/v1/delete/articles/")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            expect(res.statusCode).not.toBe(200);
        });
    });
});