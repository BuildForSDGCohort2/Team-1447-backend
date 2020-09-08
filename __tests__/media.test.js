const app = require("../app");
const cloudinary = require("../middlewares/cloudinary-config");
const pool = require("../src/models/database");
const request = require("supertest");
require("dotenv").config();

describe( "MediaCtrl", () => {
    describe( "User can create media with correct Token and Valid content-type" , () => {
        beforeEach( async () => {
            await pool.query("DELETE FROM media");
        });
        test( "POST/create/media" , async () => {
            // ! check on the internet on how to send multipart/form-date using supertest
            // const paths = ["./test-images/dog.jpg", "./test-images/pup.jpg"];
            // const tmpObj = {"image": "./test-images/dog.jpg", postedOn: "4003-02-29", mediaCaption: "LOREM"}

            const res = await request(app)
            .post("/api/v1/media/upload")
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.TOKEN)
            .field("postedOn", "2008-04-03")
            .field("mediaCaption", "LOREM")
            .attach("image", "./test-images/dog.jpg");
            expect(res.statusCode).toBe(201);
        });
    });

    describe("User should not create media with Incorrect Token", () => {
        beforeEach( async () => {
            await pool.query("DELETE FROM media");
        });
        
        test("POST/create/media", async () => {

            // const paths = ["./test-images/dog.jpg", "./test-images/pup.jpg"]
            // const tmpObj = {"file1": null, "file2": null, postedOn: "4003-02-29", mediaCaption: "LOREM"}
            // const tmpObj = {"image": "./test-images/dog.jpg", postedOn: "4003-02-29", mediaCaption: "LOREM"}
            // paths.forEach((file) => {
            //     let counter = 0;
            //     tmpObj[`file${0+1}`] = file; this will also work
            //     tmpObj[`file${counter}`] = file;
            //     counter++;
            // });

            // const arr = fs.readdirSync("./test-images", "utf-8").map(file => {image: file});
            // const img = {...arr};

            const res = await request(app)
            .post("/api/v1/media/upload")
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.FK_TOKEN)
            .field("postedOn", "2008-04-03")
            .field("mediaCaption", "LOREM")
            .attach("image", "./test-images/dog.jpg");
            expect(res.statusCode).not.toBe(201);           
        });
    });

    describe("User can get media with Token and valid content-type", () => {
        let mediaId;
        beforeEach( async () => {
            const ext = "image";
            const mediaUrl = "./test-images/pup.jpg";
            const mediaType = "png";
            const postedOn = "2003-04-04";
            const postedBy = 25;
            const mediaCaption = "Waka don flocka";
            const query = `INSERT INTO media(media_ext, media_url, media_type, media_date_of_pub, media_caption, media_posted_by) 
                           VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING media_id`;
            const values = [ext, mediaUrl, mediaType, postedOn , mediaCaption, postedBy];
            const result = await pool.query(query, values);
            mediaId = result.rows[0].media_id;
        });
        
        test("GET/media/:mediaId", async () => {

            const res = await request(app)
            .get(`/api/v1/media/${mediaId}`)
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.TOKEN); 
            expect(res.statusCode).toBe(200);           
        });
    });

    describe("User can get media with Incorrect Token", () => {
        let mediaId;
        beforeEach( async () => {

            const ext = "image";
            const mediaUrl = "./test-images/pup.jpg";
            const mediaType = "png";
            const postedOn = "2003-04-04";
            const postedBy = 25;
            const mediaCaption = "Waka don flocka";
            const query = `INSERT INTO media(media_ext, media_url, media_type, media_date_of_pub, media_caption, media_posted_by) 
                            VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING media_id`;
            const values = [ext, mediaUrl, mediaType, postedOn , mediaCaption, postedBy];
            const result = await pool.query(query, values);
            mediaId = result.rows[0].media_id;
        });
        
        test("GET/media/:mediaId", async () => {

            const res = await request(app)
            .get(`/api/v1/media/${mediaId}`)
            .set("Accept", "multipart/form-data")
            .set("authorization", process.env.FK_TOKEN);
            expect(res.statusCode).not.toBe(200);           
        });
    });
});
