const router = require("express").Router();
const multer = require('../middlewares/multer-config');
const MediaCtrl = require("../controllers/mediaCtrl");

router.post("@:username/media/upload", multer.single("image"), MediaCtrl.createMedia);
router.get("@:username/media/:mediaId", MediaCtrl.getOneGif);
router.delete("@:username/media/:mediaId", MediaCtrl.deleteOneMedia);

module.exports = router;