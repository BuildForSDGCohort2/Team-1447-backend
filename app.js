const express = require('express');
const db = require('./models/database');
// const user = require('./routes/userRoute');
// const article = require('./routes/articleRoutes');
// const media = require('./routes/media'); 
// const admin = require('./routes/admin');

// intialize express
const app = express();

// setup bodyParser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// homepage
app.get('/', () => {
    res.status(200).json('Welcome to devstories');
});

// setup the routes
// app.use('api/v1/', user);
// app.use('api/v1/', article);
// app.use('api/v1/', media);
// app.use('api/v1/', admin);
// app.use('api/v1/', media);

module.exports = app;