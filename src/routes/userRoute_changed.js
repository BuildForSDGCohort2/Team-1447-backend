const express = require("express");
const router = express.Router();
const Auth = require("../../middlewares/auth"); 
const UserCtrl = require("../controllers/userCtrl_changed");

// Routes for userctrl
router.post("/auth/signup", UserCtrl.creatUser);
router.post("/auth/signin", UserCtrl.login);
router.post("/forgot-password", UserCtrl.forgotPassword);
router.post("/change-password", Auth.verifyResetToken, UserCtrl.changePassword);
router.post("/reset-password", Auth.verifyUser, UserCtrl.resetPassword);
// router.get("/profile/:userId", Auth.verifyUser, UserCtrl.profile);
router.get("/profile", Auth.verifyUser, UserCtrl.profile);
router.patch("/profile/edit", Auth.verifyUser, UserCtrl.editProfile);

module.exports = router;