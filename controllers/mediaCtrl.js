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

    static async createMedia(req,res){
        const uploader = async (path) => await cloudinary.uploads(path, 'My Assets');
        
        if(req.method === 'POST') {
            const url = [];
            const {path} = req.file;
            const newPath = await uploader(path);
            url.push(newPath);
            fs.unlinkSync(path);

            const gif_link = url[0].url;
            const query = "INSERT INTO media(f) VALUES() RETURNING *"
        }

        if (req.method === 'POST') {
        const url = [];
        const {path} = req.file;
        const newPath = await uploader(path)
        url.push(newPath);
        fs.unlinkSync(path);
        
        if (req.employee) {
            const gif_link = url[0].url;
            const query = 'INSERT INTO gifs (gif_link) VALUES($1) RETURNING*'
            const value = [gif_link]
            pool.query('SELECT * FROM gifs where gif_link = $1', [gif_link])
            .then((resultCheck) => {
                if (resultCheck > 0) {
                    return res.status(400).json({status: 400, message: 'Record already exist'})
                }
            }
        ).catch((error) => {res.status(500).json({error : `Something Unexpected Happen ${error}`})});
        
        pool.query(query,value)
        .then((result) => {
            res.status(201).json({status:201, data: result.rows[0]}) 
        }).catch((error) => { res.status(500).json({status: 400, message: `Something Unexpected happen ${error}`})});
    }
        else {
            return  res.status(400).json({status: 400, message: 'You are not authorize to use this routes'})
            }
        
    
    
        } else {
        res.status(405).json({
            err: `${req.method} method not allowed`
        })}
        
        
        
    }
}

module.exports = MediaCtrl