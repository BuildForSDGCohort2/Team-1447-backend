const pool = require("../models/database");

class CommentCtrl {
    
    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof CommentCtrl
     */

    static async createComment(req, res) {
        try {
            const userId = req.id;
            const { comment, articlePostedOn, dateOfPub, mediaPostedOn } = req.body;
            const query = "INSERT INTO comments(comment, article_posted_on, date_of_pub, media_posted_on, posted_by) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const values = [ comment, articlePostedOn, dateOfPub, mediaPostedOn, userId ];
            const result = await pool.query(query, values);
            if (result.rowCount > 0) {
                res.status(201).json({
                    status: "success",
                    message: "Comment posted successfully",
                    data: {
                        comments: result.rows
                    }
                });
            }
            else {
                res.status(404).json({
                    message: "Comment not posted"
                });
            }
        }
        catch (error) {
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
     * @memberof CommentCtrl
     */

    static async  getAllMediaComments(req, res) {

        try {
            const {mediaId} = req.params;
            const result = await pool.query("SELECT * FROM comments WHERE media_posted_on=$1 ORDER BY media_date_of_pub DESC", [mediaId]);
            console.log(result.rows);
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "Media doesn't exist"
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

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof CommentCtrl
     */

    static async  getAllArticleComments(req, res) {

        try {
            const {articleId} = req.params;
            const result = await pool.query("SELECT * FROM comments WHERE article_posted_on=$1", [articleId]);
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "Article doesn't exist"
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


    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof CommentCtrl
     */

    static async getOneComment(req, res) {

        try {
            const {commentId} = req.params;
            const result = await pool.query("SELECT comment FROM comments WHERE comment_id=$1", [commentId] );
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                });
            } else{
                res.status(404).json({
                    status: "error",
                    message: "Comment not found"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof CommentCtrl
     */

    static async editOneComment(req, res) {
        try {
            const {commentId, comment} = req.body;

            const result = await pool.query("UPDATE comments SET comment=$1 WHERE comment_Id=$2 RETURNING *", [ comment, commentId]);
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "status",
                    message: "Comment successfully edited",
                    data:{
                        result: result.rows
                    }
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Comment could not be edited"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof CommentCtrl
     */

    static async deleteOneComment(req, res) {
        try {
            const {commentId} = req.params;

            const result = await pool.query("DELETE comments WHERE comment_id=$1", [commentId]);
            if (result.rowCount > 0) {
                res.status(200).json({
                    status: "status",
                    message: "Comment successfully deleted"
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Comment could not be deleted"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }
}

module.exports = CommentCtrl