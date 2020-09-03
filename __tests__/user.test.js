const app = require("../src/app")
const request = require("supertest");
require("dotenv").config();

describe("Userctrl", ()  => {
    // avatar/profile img should be done on signup
    describe("correct password and email",() => {
      test("user should login", async () => {
        const loginDetails = {
          "loginData": process.env.EMAIL,
          "password": process.env.PASSWORD
        };
        const res = await request(app)
        .post("/api/v1/auth/login")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN)
        .send(loginDetails)
        expect(res.statusCode).toBe(200)
      });
    });

    describe("incorrect password and correct email/username", () => {
      const loginDetails = {
        "loginData": process.env.EMAIL,
        "password": process.env.FK_PASSWORD
      }
      test("user should not be able to login", async () => {
        const res = await request(app)
      .post("/api/v1/auth/login")
      .set("content-type", "application/json")
      .set("authorization", process.env.TOKEN)
      .send(loginDetails)
      expect(res.statusCode).not.toBe(200)
      });
    });

    describe( "correct password and incorrect email/username", () => {
      const loginDetails = {
        "loginData": process.env.FK_EMAIL,
        "password": process.env.PASSWORD
      }
      test( "user should not be able to login", async () => {
        const res = await request(app)
        .post("/api/v1/auth/login")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN)
        .send(loginDetails)
        expect(res.statusCode).not.toBe(200)
      });
    });
    
    describe( "Incorrect token used" ,() => {
      const loginDetails = {
          "loginData": process.env.FK_EMAIL,
          "password": process.env.PASSWORD
        }

        test( "user should not be able to login", async () => {
          const res = await request(app)
          .post("/api/v1/auth/login")
          .set("content-type", "application/json")
          .set("authorization", process.env.FK_TOKEN)
          .send(loginDetails)
          expect(res.statusCode).toBe(500)
        });
    });

    //! Create user sign up test
});