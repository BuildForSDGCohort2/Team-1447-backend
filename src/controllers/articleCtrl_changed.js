const {pool} = require("../models/database_changed");

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
            //! THE DATE OF PUB SHOULD ONE BE SET BY JAVASCRIPT OR POSTGRES
            const {article_title, article_body, article_date_of_pub} = req.body;
            console.log(article_title, article_body, article_date_of_pub, req.id)
        
            const query =  `INSERT INTO article(article_title, article_body, article_date_of_pub, article_posted_by) VALUES($1, $2, $3,$4) RETURNING *`;
            
            const values = [article_title, article_body, article_date_of_pub, req.id];
    
            const result = await pool.query(query, values);

            if (result.rowCount === 0) {
                res.status(404).json({
                    status: "error",
                    message: "You didn't complete all required field"
                })
            }else {
                // set obj for caching
                res.locals = {
                    status: "success",
                    data: [{
                        message: "Article successfully posted",
                        createdOn: result.rows[0].article_date_of_pub,
                        articleId: result.rows[0].article_id,
                        title: result.rows[0].article_title
                    }]
                }
                // server response
                res.status(201).json({
                    status: "success",
                    message: "Article Successfully Created",
                    data: result.rows
                });
            }
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
        // const userId = req.params.id
        const userId = req.id;
        // console.log(userId);
        try { 
                //! give each attribute distinct name
                // const query = `
                // SELECT article_id , article_header, article.posted_by, article_body, article.date_of_pub, comment_id, comment, 
                // comments.date_of_pub, comments.posted_by, article_posted_on, media_id, media_caption,
                // media_url, user_name, user_id FROM article LEFT JOIN comments ON article_posted_on=article_id 
                // LEFT JOIN media ON media_id=media_posted_on LEFT JOIN users ON ${userId}=comments.posted_by 
                // WHERE user_id=${userId} ORDER BY article.date_of_pub DESC`;
                // const result = await pool.query("SELECT article_header, article_body, date_of_pub, avatar_url FROM article INNER JOIN users ON user_id = posted_by WHERE posted_by=$1", [userId]);  
                // const result = await pool.query("SELECT * FROM article WHERE posted_by=$1 ORDER BY article_id ", [userId]); 
                // const result = await pool.query(query);
                // SELECT article_id, article_header, article.posted_by, article.date_of_pub, comment_id, comment, comments.date_of_pub, comments.posted_by, article_posted_on, media_posted_on, user_name, user_id FROM article LEFT JOIN comments ON article_id=comments.media_posted_on LEFT JOIN users ON comments.posted_by=user_id ORDER BY article.date_of_pub, comments.date_of_pub DESC;
                // SELECT article_id , article_header, article.posted_by, article.date_of_pub, comment_id, comment, comments.date_of_pub, comments.posted_by, article_posted_on, media_id, media_caption, media_url, user_name, user_id FROM article FULL JOIN comments ON article_posted_on=article_id FULL JOIN media ON media_posted_on=media_id FULL JOIN users ON user_id=comments.posted_by;  
                
                const result1 = await pool.query(
                    `SELECT article_id, article_title, article_body, article_date_of_pub, article_posted_by FROM 
                    article WHERE article_posted_by=${userId} ORDER BY article_date_of_pub DESC`); //! Set a limit
                // ! change to article_poste_by
                // const articleId = result1
                // console.log(result1.rows)

                // const result1 = await pool.query(`SELECT article_id, article_header, article_body, article_posted_by, article_date_of_pub, 
                //     comment_id, comment, date_of_pub, posted_by, media_posted_on, 
                //     user_name, user_id FROM article LEFT JOIN comments ON article_id=comments_media_posted_on 
                //     LEFT JOIN users ON comments_posted_by=user_id WHERE article_id=${articleId} ORDER BY article_date_of_pub DESC`);
                if (result1.rowCount > 0) {
                    // set object for caching
        
                    for (let i = 0; i < result1.rowCount; i++) {

                        const mod = await pool.query(`SELECT * FROM comments WHERE article_posted_on=${result1.rows[i].article_id} ORDER BY comment_date_of_pub DESC`);
                    
                        if (mod.rowCount > 0) {
                            result1.rows[i].comments = mod.rows
                        }else{
                            result1.rows[i].comments = []
                        }
                    }

                    res.locals = {
                        status: "success",
                        data: {
                            result: result1.rows
                        }
                    }

                    return res.status(200).json({
                        status: "success",
                        code: 200,
                        data: result1.rows
                    })
            
                    // server response
                    // console.log(result.rows)
                    // res.status(200).json({
                    //     status: "success",
                    //     data: {
                    //         result: result.rows
                    //     }
                    // });
    
                }else {
                    res.status(404).json({
                        status: "error",
                        code: 404,
                        data: {
                            message: "Articles not found",
                        }
                    });
                }
            } catch (error) {
                
                res.status(500).json({
                    status: "error",
                    code: 500,
                    data:{
                        message: "Something went wrong",
                    },
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
    
    static async getOneArticle(req, res) {
        //! This is where i will do the join statement(inner or outer) to join to table together
        // ? Do what i did in the getAllArticleCtrl IGNORE COMMENT ABOVE
        try {
            const articleId = Number(req.params.article_id);
            // ! CHECK THE QUERY AND ALTERED DB
            // const query = `SELECT article_id, article_title, article_body, article_posted_by, article_date_of_pub, 
            //                comment_id, comment, comment_date_of_pub, comment_posted_by, media_posted_on, 
            //                user_name, user_id FROM article LEFT JOIN comments ON article_id=article_posted_on
            //                LEFT JOIN users ON comment_posted_by=user_id WHERE article_id=${articleId} ORDER BY article_date_of_pub DESC`;

            const query = 'SELECT * FROM article WHERE article_id=$1';

            const result = await pool.query(query, [articleId]);

            if (result.rowCount > 0){
                
                const mod = await pool.query(`SELECT * FROM comments WHERE article_posted_on=${articleId} ORDER BY comment_date_of_pub DESC`);
                
                if (mod.rowCount > 0) {
                    result.rows[0].comments = mod.rows;
                }else{
                    result.rows[0].comments = [];
                }
            
                res.status(200).json({
                    status: "success",
                    data: result.rows
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Couldn't find article"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong",
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

     static async editOneArticle(req, res) {

        try {
            const articleId = Number(req.params.article_id);
            const {
                article_title, 
                article_body, 
                article_date_of_pub, 
                article_posted_by
            } = req.body;
            

            const query = `UPDATE article SET article_body=$1, article_title=$2, article_date_of_pub=$3, article_posted_by=$4 WHERE article_id=$5 RETURNING*`;
         
            const values = [article_body, article_title, article_date_of_pub, article_posted_by, articleId];
            const result = await pool.query(query, values);

            if (result.rowCount > 0) {

                res.locals = {
                    data: {
                        status: "success",
                        message: "Article has been updated",
                        title: result.rows.article_title,
                        article: result.rows.article_body
                    }
                }

                res.status(201).json({
                    data: {
                        status: "success",
                        message: "Article has been updated",
                        title: result.rows.article_title,
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
            const articleId = Number(req.params.article_id);
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
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof ArticleCtrl
     */

     static async deleteAllArticle(req, res) {
         try {
             const userId = Number(req.params.user_id);
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
                    message: "No Article to Delete"
                });
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