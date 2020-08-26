const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/database');
require('dotenv').config();

// Sign Up ctrl
class UserCtrl{
    /**
     * static
     * @params {Object} req
     * @params {Object} res
     * @returns JSON
     * @memberof UserCtrl
     */
  
    static signUp(req,res){
        const {firstName, lastName, dateOfBirth, email, phonenumber, gender, isadmin, avatarUrl,password} = req.body;

    }
}

module.exports = UserCtrl;