const app = require("../app");
const request = require("supertest");
const shortId = require("shortid");
require("dotenv").config();

describe("Userctrl", ()  => {
  const email = `${shortId.generate()}@gmail.com`;
  describe( "User sign up with correct email" ,() => {

    test( "POST/auth/signup" , async () => {
     
      const loginDetails = {
        firstName : "LEONARD", 
        lastName: "KWAHI",
        userEmail: email, 
        userName: "kawls", 
        dateOfBirth: "1009-02-04",  
        phonenumber: "0494049", 
        gender: "Female", 
        isAdmin: false, 
        avatarUrl: "jfkdjfk.com", 
        password: "nbachamps"
      }
     
      const res = await request(app)
      .post("https://www.apidevstory.herokuapp.com/api/v1/auth/signUp")
      .set("content-type", "application/json")
      .send(loginDetails);
      // token = res.body.data.token;
      expect(res.statusCode).toBe(201);
    });

  });

  describe( "User should not sign up with" ,() => {

    test( "POST/auth/signup" , async() => {

      const loginDetails = {
        firstName : "KWAHI", 
        lastName: "LEONARD", 
        dateOfBirth: "1009-02-04", 
        userEmail: email, 
        phonenumber: "0494049", 
        gender: "Female", 
        userName: "kawls", 
        isAdmin: false, 
        avatarUrl: "jfkdjfk.com", 
        password: "nbachamps"
      };

      const res = await request(app)
      .post("https://www.apidevstory.herokuapp.com/api/v1/auth/signUp")
      .set("content-type", "application/json")
      .send(loginDetails);
      expect(res.statusCode).not.toBe(201);
    });

  });


    // avatar/profile img should be done on signup
    describe("correct password and email",() => {
      test("user should login", async () => {
        const loginDetails = {
          "loginData": process.env.EMAIL,
          "password": process.env.PASSWORD
        };
        const res = await request(app)
        .post("https://www.apidevstory.herokuapp.com/api/v1/auth/login")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN)
        .send(loginDetails);
        expect(res.statusCode).toBe(200);
      });
    });

    describe("incorrect password and correct email/username", () => {
      const loginDetails = {
        "loginData": process.env.EMAIL,
        "password": process.env.FK_PASSWORD
      }
      test("user should not be able to login", async () => {
        const res = await request(app)
      .post("https://www.apidevstory.herokuapp.com/api/v1/auth/login")
      .set("content-type", "application/json")
      .set("authorization", process.env.FK_TOKEN)
      .send(loginDetails);
      expect(res.statusCode).not.toBe(200);
      });
    });

    describe( "correct password and incorrect email/username", () => {
      const loginDetails = {
        "loginData": process.env.FK_EMAIL,
        "password": process.env.PASSWORD
      }
      test( "user should not be able to login", async () => {
        const res = await request(app)
        .post("https://www.apidevstory.herokuapp.com/api/v1/auth/login")
        .set("content-type", "application/json")
        .set("authorization", process.env.TOKEN)
        .send(loginDetails);
        expect(res.statusCode).not.toBe(200);
      });
    });
    
    describe( "Incorrect process.env.TOKEN used" ,() => {
      const loginDetails = {
          "loginData": process.env.FK_EMAIL,
          "password": process.env.PASSWORD
        }

        test( "user should not be able to login", async () => {
          const res = await request(app)
          .post("https://www.apidevstory.herokuapp.com/api/v1/auth/login")
          .set("content-type", "application/json")
          .set("authorization", process.env.FK_TOKEN)
          .send(loginDetails);
          expect(res.statusCode).toBe(500);
        });
    });
});
