[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8986e24883ec4a899a0450695247bea3)](https://app.codacy.com/gh/BuildForSDGCohort2/Team-1447-backend?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDGCohort2/Team-1447-backend&utm_campaign=Badge_Grade_Dashboard)

# Team-1447-Backend

This is the api for devstory app (Team-1447).

This is the working specification for the resources. Devstory.
    1. Article
    2. Media
    3. Users
    4. Comments

The following table contains the resources and their uses

All endpoint begin with `api/v1/` example `api/v1/login`

###                  Users<br/>
HTTP Verb | Path | Controllers#Action | Used for 
--------- | ---- | ------------------ | -------- 
POST | /signUp | users#createUser | sign up user
POST | /login | users#loginUser | login user
POST | /forgotPassword | users#forgotPassword | reclaim password forgotten
POST | /resetPassword | users#resetPassword | change password when logged in
GET | /profile/:userId | users#profile | displays users profile

###                 Article<br/>
HTTP Verb | Path | Controllers#Action | Used for 
--------- | ---- | ------------------ | -------- 
POST | /create/article | article#createArticle | create an article
GET | /feed | article#displayAllArticle | enables user to get feed of all articles and images in chronological order
GET | /article/:articleId | article#getOneArticle | display an article
PATCH | /article/edit/:articleId | article#editOneArticle | edit an article
DELETE | /article/delete/:articleId | article#deleteOneArticle | delete an article
DELETE | /delete/articles/:userId | article#deleteAllArticle | delete all article

### Comments
HTTP Verb | Path | Controllers#Action | Used for 
--------- | ---- | ------------------ | -------- 
POST | /comment | comment#createComment | create a comment
GET | /article/:articleId/comments | comment#getAllArticleComments | displays all comment of a particular article 
GET | /media/:mediaId/comments | comment#getAllMediaComments | display all comments of a particular media
GET | /comments/:commentId | comment#getOneComment | display a comment
PATCH | /edit/comment | comment#editOneComment | edit a comment
DELETE | /:articleId/comments/:commentId | comment#deleteOneComment | delete a comment

## Media
HTTP Verb | Path | Controllers#Action | Used for 
--------- | ---- | ------------------ | -------- 
POST | /media/upload | media#createComment | create a media
GET | /media/:mediaId | media#getOneMedia | displays a particular media using id
DELETE | /media/:mediaId | media#deleteOneMedia | delete a media

## Search
HTTP Verb | Path | Controllers#Action | Used for 
--------- | ---- | ------------------ | -------- 
GET | /search | search#search | search for users 