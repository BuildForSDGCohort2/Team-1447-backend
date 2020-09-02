const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth"); 
const UserCtrl = require("../controllers/userCtrl");

// Routes for userctrl
router.post("/auth/signUp", UserCtrl.creatUser);
router.post("/auth/login", Auth.verifyUser , UserCtrl.login);
router.post("/forgotPassword", UserCtrl.forgotPassword);
router.post("/changePassword", Auth.verifyResetToken, UserCtrl.changePassword);
router.post("/resetPassword", Auth.verifyUser, UserCtrl.resetPassword);
router.get("/profile/:userId", Auth.verifyUser, UserCtrl.profile);

module.exports = router;