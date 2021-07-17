const router = require("express").Router();
const Auth = require("../../middlewares/auth");
const searchCtrl = require("../controllers/search_changed");

router.get("/search", Auth.verifyUser, searchCtrl)

module.exports = router;