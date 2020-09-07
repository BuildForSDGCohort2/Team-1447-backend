CREATE TABLE IF NOT EXISTS
    users( 
        user_id SERIAL NOT NULL,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        date_of_birth DATE NOT NULL,
        email VARCHAR(128) NOT NULL,
        password TEXT NOT NULL,
        user_name VARCHAR(128) NOT NULL,
        phone_number VARCHAR(128) NOT NULL,
        gender VARCHAR(128) NOT NULL,
        is_admin BOOLEAN NOT NULL,
        avatar_url URL NOT null,
        UNIQUE(user_name, email, phone_number,user_id),
        PRIMARY KEY(user_id)
    );

CREATE TABLE IF NOT EXISTS
    article(
        article_id SERIAL  NOT NULL PRIMARY KEY UNIQUE,
        article_header TEXT NOT NULL,
        article_body TEXT NOT NULL,
        article_posted_by INT NOT NULL,
        article_date_of_pub TIMESTAMP NOT NULL,
        FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    comments(
        comment_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        comment TEXT NOT NULL,
        article_posted_on INT ,
        media_posted_on INT,
        comment_posted_by INT NOT NULL,
        comment_date_of_pub DATE NOT NULL,
        FOREIGN KEY (article_posted_on) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (media_posted_on) REFERENCES media(media_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    avatar(
        avatar_id SERIAL PRIMARY KEY NOT NULL,
        avatar_url TEXT NOT NULL,
        posted_by INT NOT NULL,
        FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    );

CREATE TABLE IF NOT EXISTS
    hyperlink(
        hyperlink_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        hyperlink TEXT,
        posted_on INT NOT NULL,
        posted_by INT NOT NULL,
        FOREIGN KEY(posted_on) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY(posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    
CREATE TABLE IF NOT EXISTS
    media(
        media_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        media_caption VARCHAR(200),
        media_type VARCHAR(128),
        media_ext VARCHAR(128),
        media_url TEXT,
        date_of_pub DATE NOT NULL,
        media_posted_by INT NOT NULL,
        FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

     -- FOREIGN KEY (posted_on) REFERENCES article(article_id) ON DELETE CASCADE ON UPDATE CASCADE,