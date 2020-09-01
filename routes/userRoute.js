const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth"); 
const UserCtrl = require("../controllers/userCtrl");

// Routes for userctrl
router.post("/auth/signUp", UserCtrl.creatUser);
router.post("/auth/login", Auth.verifyUser , UserCtrl.login);

module.exports = router;