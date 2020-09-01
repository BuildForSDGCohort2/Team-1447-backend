const router = require("express").Router();
const multer = require('../middlewares/multer-config');
const MediaCtrl = require("../controllers/mediaCtrl");

router.post("/media/upload", multer.single("image"), MediaCtrl.createMedia);
router.get("/media/:mediaId", MediaCtrl.getOneGif);
router.get("/media/:mediaId", MediaCtrl.deleteOneMedia);

module.exports = router;