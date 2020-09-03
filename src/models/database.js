const {Pool} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let connectionString;

const environmentVariable = process.env.NODE_ENV;
if (environmentVariable.includes('test')) {
  connectionString = process.env.PG_CONNECTION_STRING;

} else {
  connectionString = process.env.PRODUCTION;
}

const pool = new Pool({
    connectionString
});

pool.on('connect',() => console.log('working'));

module.exports = pool;
