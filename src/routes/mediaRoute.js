const router = require("express").Router();
const multer = require('../../middlewares/multer-config');
const Auth = require("../../middlewares/auth")
const {getCache, setCache, clearCache} = require("../../middlewares/cache");
const MediaCtrl = require("../controllers/mediaCtrl");

router.post("/media/upload", Auth.verifyUser, multer.single("image"), MediaCtrl.createMedia, clearCache);
router.get("/media/:mediaId", Auth.verifyUser, getCache, MediaCtrl.getOneGif, setCache);
router.delete("/media/:mediaId", Auth.verifyUser, MediaCtrl.deleteOneMedia, clearCache);

module.exports = router;