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
            const { comment, postedOn, postedBy } = req.body;
            const query = "INSERT INTO comments(comment, posted_on, posted_by) VALUES($1, $2, $3) RETURNING* ";
            const values = [comment, postedOn, postedBy];
            const result = await pool.query(query, values);
            if (result.rowCount > 0) {
                res.status(201).json({
                    status: "success",
                    message: "Comment posted successfully",
                    data: {
                        result: result.rows
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

    static async  getAllComments(req, res) {

        try {
            const {articleId} = req.params;
            const result = await pool.query("SELECT * FROM comments WHERE posted_on=$1", [articleId]);
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
                    message: "Something went wrong"
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
     * @memberof CommentCtrl
     */

    static async getOneComment(req,res) {

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
            })
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

            const result = pool.query("DELETE comments WHERE comment_id=$1", [commentId]);
            if ((await result).rowCount > 0) {
                res.status(200).json({
                    status: "status",
                    message: "Comment successfully deleted"
                });
            }else{
                res.status(404).json({
                    status: "error",
                    message: "Comment could not be deleted"
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            })
        }
    }
}



module.exports = CommentCtrl