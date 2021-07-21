const {Pool} = require("pg");
// require("dotenv").config()

// ! REMOVE "dotenv" dep
// ! ADD ENV VARS IN HEROKU (process.env.DATABASE_URL) AND (process.env.TOKEN_SECRET)
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

// const pool = new Pool({
//   connectionString : process.env.PG_CONNECTION_STRING_CHANGED
// });

pool.on('connect', () => console.log('Working'))

const usersF = async () => {
  const userTable = `
  CREATE TABLE IF NOT EXISTS
  users( 
      user_id SERIAL NOT NULL UNIQUE,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      date_of_birth DATE NOT NULL,
      email VARCHAR(128) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      user_name VARCHAR(128) NOT NULL UNIQUE,
      phone_number VARCHAR(128) NOT NULL UNIQUE,
      gender VARCHAR(128) NOT NULL,
      is_admin BOOLEAN NOT NULL,
      avatar_url TEXT,
      PRIMARY KEY(user_id)
  );`;
  await pool.query(userTable)
    .then(() => console.log('created user Table'))
};

const articleF = async () => {
  const articleTable = `
    CREATE TABLE IF NOT EXISTS
      article(
          article_id SERIAL  NOT NULL PRIMARY KEY UNIQUE,
          article_title TEXT NOT NULL,
          article_body TEXT NOT NULL,
          article_posted_by INT NOT NULL,
          article_date_of_pub TIMESTAMP NOT NULL,
          FOREIGN KEY (article_posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );`;
  await pool.query(articleTable)
    .then(() => console.log('created article Table'))
}

 const mediaF = async () => {
   const mediaTable = `
    CREATE TABLE IF NOT EXISTS
      media(
          media_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
          media_caption VARCHAR(200),
          media_type VARCHAR(128),
          media_ext VARCHAR(128),
          media_url TEXT,
          media_date_of_pub DATE NOT NULL,
          media_posted_by INT NOT NULL,
          FOREIGN KEY (media_posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      );`;
      await pool.query(mediaTable)
        .then(() => console.log('created media Table'))
 }

 const comments = async () => {
   const commentsTable = `
    CREATE TABLE IF NOT EXISTS
      comments(
          comment_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
          comment TEXT NOT NULL,
          article_posted_on INT,
          media_posted_on INT,
          comment_posted_by INT NOT NULL,
          comment_date_of_pub DATE NOT NULL,
          FOREIGN KEY (article_posted_on) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (comment_posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (media_posted_on) REFERENCES media(media_id) ON DELETE CASCADE ON UPDATE CASCADE
      );`;
      await pool.query(commentsTable)
        .then(() => console.log('created comments Table'))
 }

module.exports = {pool, usersF, articleF, mediaF, comments};