const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cors = require("cors");
const db = require("./src/models/database");
const user = require("./src/routes/userRoute");
const article = require("./src/routes/articleRoute");
const media = require("./src/routes/mediaRoute"); 
// const admin = require("./routes/admin");
const comment = require("./src/routes/commentRoute");
const search = require("./src/routes/searchRoute");

// intialize express
const app = express();

// this will be used to make rate limit on a particular route, it should be place before the jwt on the post routes
const postLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1,
  });

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // 5 requests,
});

// to make sure only your domain is the only one that has access
const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'https://www.example.com' : '*',
}

// setup bodyParser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(helmet());
app.use(compression());
app.use(limiter); // This is applicable to all routes
app.use(cors(origin));

// homepage
app.get("/", (req, res) => {
    res.status(200).json("Welcome to devstories");
});

// setup the routes
app.use("/api/v1/", user);
app.use("/api/v1/", article);
app.use("/api/v1/", media);
// app.use("/api/v1/", admin);
// app.use("/api/v1/", media);
app.use("/api/v1/", comment)
app.use("/api/v1/", search);

module.exports = app;