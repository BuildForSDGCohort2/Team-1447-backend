const express = require('express');
const router = express.Router;
const UserCtrl = require('../controllers/userCtrl');

router.post('auth/signUp', UserCtrl.creatUser);
router.post('auth/login', UserCtrl.login);

module.exports = router;