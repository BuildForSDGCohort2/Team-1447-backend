const pool = require('../models/database');
const cloudinary = require('../middlewares/cloudinary-config');

class MediaCtrl{
     /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns JSON
     * @memberof MediaCtrl
     */

    static async createMedia(req,res) {
        
        try {
            const uploader = async (path) => await cloudinary.uploads(path, 'My Assets');

            if(req.method === 'POST') {
                
                // console.log(req.extension, req.mediaType, req.file, req.body, "This is it");
                // const url = [];
                let url;
                const {path} = req.file;
                const newPath = await uploader(path);
                url = newPath;
                // url.push(newPath);
                fs.unlinkSync(path);
    
                const mediaUrl = url.url;
                const ext = req.extension;
                const mediaType = req.mediaType;
                const postedOn = "2009-03-03";

    
                const query = "INSERT INTO media(media_ext, media_url, media_type, posted_on) VALUES( $1, $2, $3, $4 ) RETURNING *";
                const values = [ext, mediaUrl, mediaType, postedOn ];

                const result = await pool.query(query, values);
                if (result.rowCount > 0) {
                    res.status(201).json({
                        status: "success",
                        message: "Media was successfully posted",
                        data: {
                            mediaId : result.rows[0].media_id,
                            createdOn: result.rows[0].posted_on,
                            title: result.rows[0].media_title,
                            mediaUrl: result.rows[0].media_url
                        }
                    })
                }
            }
        } catch (error) {
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
     * @returns JSON
     * @memberof MediaCtrl
     */

        static async getOneGif(req,res) {
            try {
                const {mediaId} = req.body;
                //! join statement to join comments and media id together
                // const res = await pool.query("SELECT comment, date_of_pub, likes FROM comments INNER JOIN media ON media_id = posted_on " )
                const result = await pool.query( "SELECT * FROM media WHERE media_id=$1 ", [mediaId]);
                const comment = await pool.query("SELECT * FROM comment W")
                if (result.rowCount > 1) {
                    res.status(200).json({
                        status: "success",
                        data: {
                            id: result.rows[0].media_id,
                            createdOn: result.rows[0].posted_on,
                            title: result.rows[0].media_title,
                            //? comments: arrays of all comments of this media id
                        }
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
     * @returns JSON
     * @memberof MediaCtrl
     */
       
     static async deleteOneMedia(req, res){
        try {
            const mediaId = Number(req.params.mediaId);
            const result = await pool.query( "DELETE FROM media WHERE media_id=$1", [mediaId]);
           
            if (result.rowCount > 0) {
                res.status(200).json({
                    message: "Deleted successfully"
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
}

module.exports = MediaCtrl;