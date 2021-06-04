const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const user = require("./src/routes/userRoute");
const article = require("./src/routes/articleRoute");
const media = require("./src/routes/mediaRoute"); 
// const admin = require("./routes/admin");
const comment = require("./src/routes/commentRoute");
const search = require("./src/routes/searchRoute");

// intialize express
const app = express();

app.disable("x-powered-by");

// this will be used to make rate limit on a particular route, it should be place before the jwt on the post routes
// const postLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 1,
//   });
// This is a limiter for the whole request
// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 5, // 5 requests,
// });

// Creates a writeable stream to the file instead of process.stdout
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// to make sure only your domain is the only one that has access
// const isProduction = process.env.NODE_ENV === "production"
// const origin = {
//   origin: isProduction ? "https://devssstory.netlify.app" : "*",
// }

// setup bodyParser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app.use(helmet());
app.use(compression());
// app.use(limiter); // This is applicable to all routes
app.use(cors());

app.use(morgan(':method   :url    :status     is done in    :response-time ms', {stream: accessLogStream}));

// homepage
app.get("/", (req, res) => {
    res.status(200).json( "Welcome to devstories" );
});

// setup the routes
app.use("/api/v1/", user);
app.use("/api/v1/", article);
app.use("/api/v1/", media);
// app.use("/api/v1/", admin);
app.use("/api/v1/", comment)
app.use("/api/v1/", search);

module.exports = app;