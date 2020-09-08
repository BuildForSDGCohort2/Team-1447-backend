const app = require("../app");
const request = require("supertest");
const pool = require("../src/models/database");
require("dotenv").config();

describe( "commentCtrl", () => {
    describe( "Create comment with Valid Token",  () => {
        test( "POST/comment", async () => {
            const comments = {
                comment: "This is the most senseless post i have read",
                postedBy: 1,
                articlePostedOn: 1,
                dateOfPub: "2003-05-03"
            }
            
            const res = await request(app)
            .post("https://www.apidevstory.herokuapp.com/api/v1/comment")
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN)
            .send(comments);
            expect(res.statusCode).toBe(201);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Create comment with Invalid Token",  () => {
        test( "POST/comment", async () => {
            const comments = {
                comment: "This is the most senseless post i have read",
                postedBy: 1,
                articlePostedOn: 1,
                dateOfPub: "2003-05-03"
            }
            
            const res = await request(app)
            .post("https://www.apidevstory.herokuapp.com/api/v1/comment")
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
            .get("https://www.apidevstory.herokuapp.com/api/v1/1/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Article ID Invalid Token",  () => {
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get("https://www.apidevstory.herokuapp.com/api/v1/1/comments")
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Media ID  and Valid Token",  () => {
        let mediaId;
        beforeEach(() => {
            const res = await request(app)
            .post("/api/v1/media/upload")
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.TOKEN)
            .field("postedOn", "2008-04-03")
            .field("mediaCaption", "LOREM")
            .attach("image", "./test-images/dog.jpg");
            mediaId = res.rows[0].media_id;
        });
        
        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/${mediaId}/comments`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.TOKEN);
            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });

    describe( "Get all comment with Media ID Invalid Token",  () => {
        let mediaId;
        beforeEach(() => {
            const res = await request(app)
            .post("/api/v1/media/upload")
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.FK_TOKEN)
            .field("postedOn", "2008-04-03")
            .field("mediaCaption", "LOREM")
            .attach("image", "./test-images/dog.jpg");
            mediaId = res.rows[0].media_id;
        });

        test( "GET/comments", async () => {
            
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/${mediaId}/comments`)
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
            const postedBy = 1;
            const articlePostedOn = 80;
            const postedOn = "2003-05-03";
            
            const query = `INSERT INTO comments(comment, article_posted_on, comment_posted_by, comment_date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, postedOn];
            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "GET/:articleId/comments/:commentId", async () => {
          
            
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/${articleId}/comments/${commentId}`)
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
            const  postedBy = 1;
            const  articlePostedOn = 1;
            const  dateOfPub = "2003-05-03";
          
            const query = `INSERT INTO comments(comment, article_posted_on, comment_posted_by, comment_date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "GET/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .get(`https://www.apidevstory.herokuapp.com/api/v1/${articleId}/comments/${commentId}`)
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
            const postedBy = 1;
            const articlePostedOn = 1;  
            const dateOfPub = "2003-05-03";
         
            const query = `INSERT INTO comments(comment, article_posted_on, comment_posted_by, comment_date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });

        test( "DELETE/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .delete(`https://www.apidevstory.herokuapp.com/api/v1/${articleId}/comments/${commentId}`)
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
            const postedBy = 1;
            const articlePostedOn = 1;
            const dateOfPub = "2003-05-03";
        
            const query = `INSERT INTO comments(comment, article_posted_on, comment_posted_by, comment_date_of_pub) VALUES($1, $2, $3, $4) RETURNING comment_id, article_posted_on`;
            const values = [comment, articlePostedOn, postedBy, dateOfPub];

            const result = await pool.query(query, values);
            commentId = result.rows[0].comment_id;
            articleId = result.rows[0].article_posted_on;
        });
        test( "DELETE/:articleId/comments/:commentId", async () => {
            
            const res = await request(app)
            .delete(`https://www.apidevstory.herokuapp.com/api/v1/${articleId}/comments/${commentId}`)
            .set("Accept", "application/json")
            .set("Authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);
            expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
        });
    });
});