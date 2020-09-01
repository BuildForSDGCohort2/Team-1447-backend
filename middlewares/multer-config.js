const multer = require("multer");
const MIMES_TYPE = {
    "image/jpg":"jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
};
let counter = 0;
let name = "devstory"
const storage = multer.diskStorage({
    // Set file destination
    destination: (req, file,callback) => {
    callback(null, "IMAGES");
    },
    filename: (req,file, callback) => {
        const extension = MIMES_TYPE[file.mimetype];
        req.extension = extension;
        const newName = name + Date.now() + "-" + file.originalname;
        callback(null,newName );
    }
});

// file validation
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")  {
        req.mediaType = "image";
        cb(null, true);
    }else{
        // cb(new Error("What is happening"))
        cb("Unsupported format", false);
    }
}

module.exports = multer({
    storage,
    limits: {fileSize: 8 * (1024 * 1024)},
    fileFilter
})