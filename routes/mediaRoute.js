const router = require("express").Router();
const multer = require('../middlewares/multer-config');
const Cache = require("../middlewares/cache");
const MediaCtrl = require("../controllers/mediaCtrl");

router.post("/media/upload", multer.single("image"), MediaCtrl.createMedia, Cache.clearCache);
router.get("/media/:mediaId", Cache.getCache, MediaCtrl.getOneGif, Cache.setCache);
router.delete("/media/:mediaId", MediaCtrl.deleteOneMedia, Cache.clearCache);

module.exports = router;