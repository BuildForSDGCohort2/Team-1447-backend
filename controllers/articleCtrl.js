const pool = require("../models/database");

class Article{

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */
    
    static async createArticle(req, res) {

        try{
            //! THE DATE OF PUB SHOULD ONE BE SET BY JAVASRIPT OR POSTGRES
            const {articleTitle, articleBody, dateOfPub, authorId} = req.body;
        
            const query =  `INSERT INTO article(article_header, article_body, date_of_pub, posted_by) VALUES($1, $2, $3,$4) RETURNING *`
            
            const values = [articleTitle, articleBody, dateOfPub, authorId];
    
            const result = await pool.query(query, values);

            if (result.rowCount === 0) {
                res.status(404).json({
                    status: "error",
                    message: "You didn\'t complete all required field"
                })
            }
            res.status(201).json({
                status: "success",
                data: [{
                    message: "Article successfully posted",
                    createdOn: result.rows[0].date_of_pub,
                    articleId: result.rows[0].article_id,
                    title: result.rows[0].article_header
                }]
            });
        }catch(error){
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error
            })
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async getAllArticle(req, res) {
        //! This is where i will do the join statement(inner or outer) to join to table together
        const userId = req.params.userId
        console.log(userId);
        try {

            // const result = await pool.query("SELECT article_header, article_body, date_of_pub, avatar_url FROM article INNER JOIN users ON user_id = posted_by WHERE posted_by=$1", [userId]);  
            const result = await pool.query("SELECT * FROM article WHERE posted_by=$1", [userId]); 
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                })
            } else {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "Articles not found"
                    }
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                data:{
                    message: "Something went wrong"
                }
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async getOneArticle(req, res) {
        //! This is where i will do the join statement(inner or outer) to join to table together
        try {
            const articleId = Number(req.params.articleId);
            const result = await pool.query("SELECT * FROM article WHERE article_id = $1", [articleId]);

            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        id: result.rows[0].article_id,
                        articleTitle: result.rows[0].article_body,  
                        article: result.rows[0].article_body,
                        authorId: result.rows.posted_by
                    }]
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Couldn\"t find article"
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            })
        }
    }

     /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

     static async editOneArticle(req,res) {

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
                res.status(201).json({
                    status: "success",
                    message: "Article has been updated",
                    title: result.rows.article_header,
                    article: result.rows.article_body
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

         
     }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

    static async deleteOneArticle(req, res){
        try {
            const articleId = Number(req.params.articleId);
            const result = await pool.query( "DELETE FROM article WHERE article_id=$1", [articleId]);
           
            if (result.rowCount > 0) {
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
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

     static async deleteAllArticle(req,res) {
         try {
             const userId = req.params.userId;
             //! A join to make article and media table delete the assoc data
            // const result = await pool.query("DELETE FROM article INNER JOIN media ON article.posted_by= media.posted_by ");
            const result = await pool.query("DELETE FROM article WHERE posted_by=$1", [userId]);
            // const result = await pool.query("DELETE FROM media WHERE posted_by=$1", [userId]);
            if(result.rowCount > 0){
                res.status(200).json({
                    status: "success",
                    message: "All article deleted"
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "All articles have already been deleted"
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
                error
            });
        }
     }

}

module.exports = Article;