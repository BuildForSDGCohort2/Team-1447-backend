const {Pool} = require("pg");

// const isProduction = process.env.NODE_ENV === "production";
//connection config for production
// const pool = new Pool({
//     connectionString: isProduction ? process.env.DATABASE_URL : process.env.HEROKU_POSTGRESQL_GREEN_URL,
//     ssl: true
// });

const pool = new Pool({
   ssl: {
    rejectUnauthorized: false
  },
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;