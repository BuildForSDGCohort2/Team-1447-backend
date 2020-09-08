const pool = require("../models/database");
// const cloudinary = require("../../middlewares/cloudinary-config");

class MediaCtrl{
     /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof MediaCtrl
     */

    static async createMedia(req, res, next) {
        
        try {
            // const uploader = async (path) => await cloudinary.uploads(path, "My Assets");

            if(req.method === "POST") {
                
                // console.log(req.extension, req.mediaType, req.file, req.body, "This is it");
                // const url = [];
                let url;
                const {path} = req.file;
                // console.log(path);
                // const newPath = await uploader(path);
                // url = newPath;
                url = path;
                // url.push(newPath);
                // fs.unlinkSync(path);
    
                // const mediaUrl = url.url;
                const mediaUrl = url;
                const ext = req.extension;
                // console.log(ext);
                const mediaType = req.mediaType;
                // console.log(mediaType)
                const id = req.id;
                // console.log(id);
                const postedOn = req.body.postedOn;
                // console.log(postedOn)
                const mediaCaption = req.body.mediaCaption;
                // console.log(mediaCaption);
                // const postedOn = "2009-03-03";
                // const mediaCaption = "Lorem"

    
                const query = 
                    `INSERT INTO media(media_ext, media_url, media_type, media_date_of_pub, media_caption, media_posted_by) 
                    VALUES( $1, $2, $3, $4, $5, $6 ) RETURNING media_id, media_url, media_caption, media_posted_by, media_date_of_pub`;
                const values = [ext, mediaUrl, mediaType, postedOn , mediaCaption, id];

                const result = await pool.query(query, values);
                
                if (result.rowCount > 0) {
                    // server response
                    res.status(201).json({
                        status: "success",
                        message: "Media was successfully posted",
                        data: {
                            mediaId : result.rows[0].media_id,
                            createdOn: result.rows[0].posted_on,
                            caption: result.rows[0].media_caption,
                            mediaUrl: result.rows[0].media_url
                        }
                    });
                    // setting object for caching
                    res.locals = {
                        data: {
                            mediaId : result.rows[0].media_id,
                            createdOn: result.rows[0].posted_on,
                            caption: result.rows[0].media_caption,
                            mediaUrl: result.rows[0].media_url
                        }
                    }
                }else {
                    res.status(404).json({
                        status: "error",
                        message: "Media could not be posted"
                    });
                }
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
     * @memberof MediaCtrl
     */

        static async getOneGif(req, res, next) {
            try {
                const mediaId = Number(req.params.mediaId);
                // console.log(req.params)
                //! join statement to join comments, media id  and users together
                // SELECT media_url, media_caption, media_id, comment_id, comment, date_of_pub, user_name FROM comments INNER JOIN media, users ON media.posted_by=comments.posted_by AND users_id=comments.posted_by;
                // SELECT media_url, media_caption, media_id, comment_id, comment, date_of_pub, user_name FROM comments INNER JOIN media ON media.posted_by=comments.posted_by INNER JOIN users ON comments.posted_by = user_id;
                // SELECT media_url, media_caption, media_id, comment_id, comment, date_of_pub, user_name FROM media WHERE media_id=38 INNER JOIN comments ON media.posted_by=comments.posted_by INNER JOIN users ON comments.posted_by = user_id;
                // SELECT media_url, media_caption, media_id, media.posted_by, media.date_of_pub, comment_id, comment, comments.date_of_pub, comments.posted_by, article_posted_on, user_name, user_id FROM media FULL JOIN comments ON media.posted_by=comments.posted_by FULL JOIN users ON comments.posted_by=user_id;
                ///////////////////////
                // SELECT media_url, media_caption, media_id, comment_id, comment, date_of_pub, user_name FROM media WHERE media_id=38 LEFT JOIN comments ON media.posted_by=comments.posted_by LEFT JOIN users ON media.posted_by=user_id;
                // SELECT media_url, media_caption, media_id, media.date_of_pub, comment_id, comment, comments.date_of_pub, user_name FROM media LEFT JOIN comments ON 38=media_posted_on LEFT JOIN users ON media.posted_by=user_id;

                // SELECT * FROM media WHERE media_id=38;

                // const res = await pool.query("SELECT comment, date_of_pub, likes FROM comments INNER JOIN media ON media_id = posted_on")
                // const result = await pool.query("SELECT * FROM media WHERE media_id=$1 ", [mediaId]);
                const query = `SELECT media_url, media_caption, media_id, media.posted_by, media.date_of_pub, 
                               comment_id, comment, comments.date_of_pub, comments.posted_by, media_posted_on, 
                               user_name, user_id FROM media LEFT JOIN comments ON media_id=comments.media_posted_on 
                               LEFT JOIN users ON comments.posted_by=user_id WHERE media_id=${mediaId} ORDER BY media.date_of_pub DESC;`
                const result = await pool.query(query);
              
                if (result.rowCount > 0) {
                
                    // const len = result.rows.length;
                    // const newArray = [];
                    // for (let i = 0; i < len; i++) {
                    //     if (result.rows[i].media_id === mediaId) {
                    //         newArray.push(result.rows[i])
                    //     }
                    // }
                    // server response
                    res.status(200).json({
                        status: "success",
                        data: {
                            // id: result.rows[0].media_id,
                            // createdOn: result.rows[0].posted_on,
                            // title: result.rows[0].media_caption,
                            // //? comments: arrays of all comments of this media 
                            result: result.rows
                        }
                    });
                    // setting object for caching
                    res.locals = {
                        status: "success",
                        data: { 
                           result: result.rows
                        }
                    }
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "Media not found"
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
     * @memberof MediaCtrl
     */
       
     static async deleteOneMedia(req, res, next){
        try {
            const mediaId = Number(req.params.mediaId);
            const result = await pool.query( "DELETE FROM media WHERE media_id=$1", [mediaId]);
           
            if (result.rowCount > 0) {
                // setting object for caching
                res.locals = {
                    message: "Deleted successfully"
                }
                // server response
                res.status(200).json({
                    message: "Deleted successfully"
                });
            }else {
                res.status(404).json({
                    message: "Media does not exist"
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
}

module.exports = MediaCtrl;