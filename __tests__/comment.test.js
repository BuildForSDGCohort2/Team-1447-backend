const app = require("../app");
const request = require("supertest");
const pool = require("../src/models/database");
require("dotenv").config();

describe( "commentCtrl", () => {
    describe( "Create comment with Valid Token",  () => {
        test( "POST/comment", async () => {
            const comments = {
                comment: "This is the most senseless post i have read",
                postedBy: 25,
                articlePostedOn: 111,
                dateOfPub: "2003-05-03"
            }
            
            const res = await request(app)
            .post("/api/v1/comment")
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN)
            .send(comments);
            expect(res.statusCode).toBe(201)
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8")
        });
    });

    describe( "Create comment with Invalid Token",  () => {
        test( "POST/comment", async () => {
            const comments = {
                comment: "This is the most senseless post i have read",
                postedBy: 25,
                articlePostedOn: 111,
                dateOfPub: "2003-05-03"
            }
            
            const res = await request(app)
            .post("/api/v1/comment")
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN)
            .send(comments);
            expect(res.statusCode).not.toBe(201);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Article ID and Valid Token",  () => {
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get("/api/v1/111/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Article ID Invalid Token",  () => {
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get("/api/v1/111/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Media ID  and Valid Token",  () => {
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get("/api/v1/37/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Media ID Invalid Token",  () => {
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get("/api/v1/37/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get a comment with Valid Token",  () => {

        let articleId, commentId;
        beforeEach( async () => {
           
            const comment = "This is the most senseless post i have read"
            const postedBy = 37;
            const articlePostedOn = 80;
            const postedOn = "2003-05-03";
            
            const query = `INSERT INTO comments(comment, article_posted_on, posted_by, date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, postedOn];
            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "GET/:articleId/comments/:commentId", async () => {
          
            
            const res = await request(app)
            .get(`/api/v1/${articleId}/comments/${commentId}`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get a comment with Invalid Token",  () => {
        let articleId, commentId;
        beforeEach( async () => {
            
            const  comment = "This is the most senseless post i have read";
            const  postedBy = 37;
            const  articlePostedOn = 80;
            const  dateOfPub = "2003-05-03";
          
            const query = `INSERT INTO comments(comment, article_posted_on, posted_by, date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "GET/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .get(`/api/v1/${articleId}/comments/${commentId}`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Delete a comment with Valid Token",  () => {

        let articleId, commentId;
        beforeEach( async () => {
        
            const comment = "This is the most senseless post i have read";
            const postedBy = 37;
            const articlePostedOn = 117;  
            const dateOfPub = "2003-05-03";
         
            const query = `INSERT INTO comments(comment, article_posted_on, posted_by, date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "DELETE/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .delete(`/api/v1/${articleId}/comments/${commentId}`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Delete a comment with Invalid Token",  () => {
        let articleId, commentId;
        beforeEach( async () => {
          
               const comment = "This is the most senseless post i have read";
               const postedBy = 37;
               const articlePostedOn = 85;
               const dateOfPub = "2003-05-03";
        
            const query = `INSERT INTO comments(comment, article_posted_on, posted_by, date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });
        test( "DELETE/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .delete(`/api/v1/${articleId}/comments/${commentId}`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });
});