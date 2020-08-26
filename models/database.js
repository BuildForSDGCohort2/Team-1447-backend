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

console.log(connectionString, 'j')

pool.on('connect',()=> {console.log('working')});

pool.query('SELECT * FROM users').then((result)=> {
    console.log(result.rows);
}).catch((err) => console.log(err));
