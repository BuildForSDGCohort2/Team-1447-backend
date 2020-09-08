const pool = require("../models/database");

class Article{

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */
    
    static async createArticle(req, res, next) {

        try{
            //! THE DATE OF PUB SHOULD ONE BE SET BY JAVASCRIPT OR POSTGRES
            const {articleTitle, articleBody, dateOfPub, authorId} = req.body;
        
            const query =  `INSERT INTO article(article_header, article_body, date_of_pub, posted_by) VALUES($1, $2, $3,$4) RETURNING *`;
            
            const values = [articleTitle, articleBody, dateOfPub, authorId];
    
            const result = await pool.query(query, values);

            if (result.rowCount === 0) {
                res.status(404).json({
                    status: "error",
                    message: "You didn\'t complete all required field"
                })
            }else {
                // set obj for caching
                res.locals = {
                    status: "success",
                    data: [{
                        message: "Article successfully posted",
                        createdOn: result.rows[0].date_of_pub,
                        articleId: result.rows[0].article_id,
                        title: result.rows[0].article_header
                    }] 
                }
                // server response
                res.status(201).json({
                    status: "success",
                    data: [{
                        message: "Article successfully posted",
                        createdOn: result.rows[0].date_of_pub,
                        articleId: result.rows[0].article_id,
                        title: result.rows[0].article_header
                    }]
                });
            }
        }catch(error){
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error
            })
        }
        next();
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async getAllArticle(req, res, next) {
        //! This is where i will do the join statement(inner or outer) to join to table together
        // const userId = req.params.id
        const userId = req.id;
        // console.log(userId);
        try {
            //! give each attribute distinct name
            const query = `
            SELECT article_id , article_header, article_posted_by, article_date_of_pub, comment_id, comment, 
            comments_date_of_pub, comments_posted_by, article_posted_on, media_id, media_caption,
            media_url, user_name, user_id FROM article LEFT JOIN comments ON article_posted_on=article_id 
            FULL JOIN media ON media_id=media_posted_on LEFT JOIN users ON user_id=comments_posted_by                   
            `;
            // const result = await pool.query("SELECT article_header, article_body, date_of_pub, avatar_url FROM article INNER JOIN users ON user_id = posted_by WHERE posted_by=$1", [userId]);  
            // const result = await pool.query("SELECT * FROM article WHERE posted_by=$1 ORDER BY article_id ", [userId]); 
            const result = await pool.query(query);
            // SELECT article_id, article_header, article.posted_by, article.date_of_pub, comment_id, comment, comments.date_of_pub, comments.posted_by, article_posted_on, media_posted_on, user_name, user_id FROM article LEFT JOIN comments ON article_id=comments.media_posted_on LEFT JOIN users ON comments.posted_by=user_id ORDER BY article.date_of_pub, comments.date_of_pub DESC;
            // SELECT article_id , article_header, article.posted_by, article.date_of_pub, comment_id, comment, comments.date_of_pub, comments.posted_by, article_posted_on, media_id, media_caption, media_url, user_name, user_id FROM article FULL JOIN comments ON article_posted_on=article_id FULL JOIN media ON media_posted_on=media_id FULL JOIN users ON user_id=comments.posted_by;  
            if (result.rowCount > 0) {
                // set object for caching
                res.locals = {
                    status: "success",
                    data: {
                        result: result.rows
                    }
                }
                // server response
                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                });

            }else {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "Articles not found"
                    }
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: "error",
                data:{
                    message: "Something went wrong",
                    error
                }
            });
        }
        next();
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async getOneArticle(req, res, next) {
        //! This is where i will do the join statement(inner or outer) to join to table together
        try {
            const articleId = Number(req.params.articleId);

            const query = `SELECT article_id, article_header, article_body, article_posted_by, article_date_of_pub, 
                           comment_id, comment, comments_date_of_pub, comments_posted_by, media_posted_on, 
                           user_name, user_id FROM article LEFT JOIN comments ON article_id=comments_media_posted_on 
                           LEFT JOIN users ON comments_posted_by=user_id WHERE article_id=${articleId} ORDER BY article_date_of_pub DESC`;

            const result = await pool.query(query);

            if (result.rowCount > 0) {
                // set property for caching
                res.locals = {
                    status: "success",
                    data: [{
                        id: result.rows[0].article_id,
                        articleTitle: result.rows[0].article_header,  
                        article: result.rows[0].article_body,
                        authorId: result.rows[0].article_posted_by
                    }]
                }
                // response sent back to client
                res.status(200).json({
                    status: "success",
                    data: [{
                        id: result.rows[0].article_id,
                        articleTitle: result.rows[0].article_header,  
                        article: result.rows[0].article_body,
                        authorId: result.rows[0].article_posted_by
                    }]
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Couldn\'t find article"
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
        next();
    }

     /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

     static async editOneArticle(req, res, next) {

        try {
            const articleId = Number(req.params.articleId);
            const {articleTitle} = req.body;
            const {articleBody} = req.body;
            const {dateOfPub} = req.body;
            const {authorId} = req.body;

            const query = "UPDATE article SET article_body=$1, article_header=$2, date_of_pub=$3, posted_by=$4 WHERE article_id=$5 RETURNING*";
         
            const values = [articleBody, articleTitle, dateOfPub, authorId, articleId];
            const result = await pool.query(query, values);

            if (result.rowCount > 0) {

                res.locals = {
                    data: {
                        status: "success",
                        message: "Article has been updated",
                        title: result.rows.article_header,
                        article: result.rows.article_body
                    }
                }

                res.status(201).json({
                    data: {
                        status: "success",
                        message: "Article has been updated",
                        title: result.rows.article_header,
                        article: result.rows.article_body
                    }
                });
            }else{
                res.status(404).json({
                    status: error,
                    message: "Article not updated"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something unexpected happen",
                error
            });
        }
        next();
     }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async deleteOneArticle(req, res , next){
        try {
            const articleId = Number(req.params.articleId);
            const result = await pool.query( "DELETE FROM article WHERE article_id=$1", [articleId]);
           
            if (result.rowCount > 0) {
                // set object for caching
                res.locals = {
                    message: "Article has been deleted successfully"
                }
                // server response
                res.status(200).json({
                    message: "Article has been deleted successfully"
                });
            }else{
                res.status(404).json({
                    message: "Article does not exist"
                });
            }
           
        } catch (error) {
            res.status(500).json({
                status: "error",
                data: {
                    message: "Something went wrong"
                }
            });
        }
        next();
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

     static async deleteAllArticle(req, res, next) {
         try {
             const userId = req.params.userId;
             //! A join to make article and media table delete the assoc data
            // const result = await pool.query("DELETE FROM article INNER JOIN media ON article.posted_by= media.posted_by ");
            const result = await pool.query("DELETE FROM article WHERE article_posted_by=$1", [userId]);
            // const result = await pool.query("DELETE FROM media WHERE posted_by=$1", [userId]);
            if(result.rowCount > 0){
                // seting object for caching
                res.locals = {
                    status: "success",
                    message: "All article deleted"
                }
                // server response
                res.status(200).json({
                    status: "success",
                    message: "All article deleted"
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "All articles have already been deleted"
                });
            }  
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error
            });
        }
        next();
     }
}

module.exports = Article;