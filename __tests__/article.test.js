const app = require("../app");
const request = require("supertest");
require("dotenv").config();

describe("Article ctrl", () => {

    describe( "post an article with correct Token", () => {
        // this article controller should deal with handling of image
        const article= {
            articleTitle: "USER ID 51",
            articleBody: "This why tech should be in Africa",
            dateOfPub: "2017-04-03",
            authorId: 1
        }

        test( "author should be able to post an article",  async () => {
            const res = await request(app)
            .post("https://www.apidevstory.herokuapp.com/api/v1/create/article")
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            .send(article);
            expect(res.statusCode).toBe(201);
            // expect(res.body.status).haveProperty("status");
        });
    });

    describe( "post an article with an incorrect Token", () => {
        // this article controller should deal with handling of image
        const article= {
            articleTitle: "This is Africa",
            articleBody: "This why tech should be in Africa",
            dateOfPub: "2017-04-03",
            authorId: 1
        }

        test( "POST /article",  async () => {
            const res = await request(app)
            .post("https://www.apidevstory.herokuapp.com/api/v1/create/article")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            .send(article);
            expect(res.statusCode).not.toBe(201);
            // expect(res.body.status).haveProperty("status");
        });
    });

    describe( "get all article with correct Token", () => {
        test( "author should be able to view all article written", async () => {

        const res = await request(app)
        .get("https://www.apidevstory.herokuapp.com/api/v1/articles")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN);
        expect(res.statusCode).toBe(200);
        });
    });

    describe( "get all article with Incorrect Token", () => {

        test( "author should be able to view all article written", async () => {
            const res = await request(app)
            .get("https://www.apidevstory.herokuapp.com/api/v1/feed")
            .set("Accept", "application/json")
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
        });
    });

    describe( "get a specific article with correct Token" , () => {
        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 1;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query( query, values);
            articleId = result.rows[0].article_id;
        });

        test( "GET /articles/:articleId" , async () => {
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/articles/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
        });
    });

    describe( "get a specific article with an Incorrect Token" ,() => {
        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 1;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query(query, values);
            articleId = result.rows[0].article_id;
        });
        test( "POST /articles/:articleId", async () => {
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/articles/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
        });
    });

    describe("edit a specific article with correct Token", () => {
        
        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 1;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query(query, values);
            articleId = result.rows[0].article_id;
        });

        test("PATCH /article/edit/:articleId", async () => {

            const article = {
                articleTitle: "Corruption is a panacea for under development",
                articleBody: "Corruption is not Stealing said a former president of the Federal Republic of Nigeria",
                dateOfPub: "2017-04-03",
                authorId: 25   
            }

            const res = await request(app)
            .patch(`https://www.apidevstory.herokuapp.com/api/v1/article/edit/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN)
            .send(article);
            expect(res.statusCode).toBe(201);
        });
    });

    describe( "edit a specific article with Incorrect Token", () => {

        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 1;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query(query, values);
            articleId = result.rows[0].article_id;
        });

        test( "PATCH /article/edit/:articleId", async () => {

            const article = {
                articleTitle: "Corruption is a panacea for under development",
                articleBody: "Corruption is not Stealing said a former president of the Federal Republic of Nigeria",
                dateOfPub: "2017-04-03",
                authorId: 25
            };

            const res = await request(app)
            .patch(`https://www.apidevstory.herokuapp.com/api/v1/article/edit/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN)
            .send(article);
            expect(res.statusCode).not.toBe(201);
        });
    });

    describe( "delete a specific article and media associated to the author with correct Token", () => {
        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 45;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query(query, values);
            articleId = result.rows[0].article_id;
        });

        test( "DELETE /articles/delete/:articleId", async () => {
            const res = await request(app)
            .delete(`https://www.apidevstory.herokuapp.com/api/v1/articles/delete/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
        });
    });

    describe( "delete an article and media associated to the author with Incorrect Token" , () => {

        let articleId;
        beforeEach(() => {
            const articleTitle = "It is so amazing";
            const articleBody = "This is so amazing, i can't explain why";
            const dateOfPub = "2020-030-01";
            const postedBy = 45;

            const query = "INSERT INTO article(article_header, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3, $4)";
            const values = [articleTitle, articleBody, dateOfPub, postedBy];
            const result = pool.query(query, values);
            articleId = result.rows[0].article_id;
        });

        test("DELETE /api/v1/delete/articles/:articleId", async () => {
            const res = await request(app)
            .delete(`https://www.apidevstory.herokuapp.com/api/v1/articles/delete/${articleId}`)
            .set("content-type", "application/json")
            .set("authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
        });
    });

    // describe( "delete all article and media associated to the author with correct Token", () => {

    //     test( "DELETE /article/", async () => {
    //         const res = await request(app)
    //         .delete("/api/v1/delete/articles/")
    //         .set("content-type", "application/json")
    //         .set("authorization", process.env.TOKEN);
    //         expect(res.statusCode).toBe(200);
    //     });
    // });

    // describe( "delete all article and media associated to the author with Incorrect Token", () => {
    //     test( "DELETE /article/", async () => {
    //         const res = await request(app)
    //         .delete("https://www.apidevstory.herokuapp.com/api/v1/delete/articles/")
    //         .set("content-type", "application/json")
    //         .set("authorization", process.env.FK_TOKEN);
    //         expect(res.statusCode).not.toBe(200);
    //     });
    // });
});