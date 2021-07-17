const router = require("express").Router();
const multer = require('../../middlewares/multer-config');
const Auth = require("../../middlewares/auth")
const {getCache, setCache, clearCache} = require("../../middlewares/cache");
const MediaCtrl = require("../controllers/mediaCtrl_changed");

router.post("/media/upload", Auth.verifyUser, multer.single("image"), MediaCtrl.createMedia);
router.get("/media/:mediaId", Auth.verifyUser, MediaCtrl.getOneMedia);
router.delete("/media/:mediaId", Auth.verifyUser, MediaCtrl.deleteOneMedia);

module.exports = router;