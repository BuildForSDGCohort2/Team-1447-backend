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
  
     // User Sign Up
    static async creatUser(req,res){
        const {firstName, lastName, dateOfBirth, email, phonenumber, gender, isadmin, avatarUrl,password} = req.body;
        try {
            // Generate the salt
            let salt = await bcrypt.genSalt(10);
            // Generate the hast with the salt
            let hash = await bcrypt.hash(password,salt);
            console.log(hash);
            if(hash){
                let resultCheck = await query('SELECT email from users WHERE email=$1', [email]);
                if (resultCheck.rowCount > 0){
                    res.status(409).json({
                        status: 'error',
                        data: { message: 'User already exists with this email'}
                    })
                }
            
                let query = 
                `INSERT INTO users(first_name, last_name, date_of_birth, email, phonenumber, gender, isadmin, avatar_url, hash 
                VALUE($1,$2,$3,$4,$5) RETURNING first_name, last_name, date_of_birth, email, phonenumber, gender isadmin, avatar_url`;
                let value = [firstName, lastName, dateOfBirth, email, phonenumber, gender, isadmin, avatarUrl, hash];

                // Query the database to insert the records
                let res = await pool.query(query,value);
            }
        } catch (error) {
            res.status('500').json({
                data: {
                    status: 'error',
                    message: 'Something  went Wrong',
                    error: error
                }
            });
        }
    }

    /**
     * static
     * @params {Object} req
     * @params {Object} res
     * @returns JSON
     * @memberof UserCtrl
     */

    // User login logic
    static async login(req, res){
        try {
            const {loginData, password}= req.body;

            let result = await pool.query('SELECT user_id email is_admin password FROM users WHERE email=$1 OR username=$1', [loginData]);

            let email = result.rows.email;  

            // Generate hash with password recently by the user
            const salt = await bcrypt.genSalt(10);
            const recentlyPasswordHash = await bcrypt.hash(salt, password);

            // Database hash
            let dbPasswordHash = result.rows.password;

            // Compare both hashes to check validity
            let compare = await bcrypt.compare(recentlyPasswordHash, dbPasswordHash);

            if(result.rowCount === 0){
               res.status('404').json({
                   status: 'error',
                   data:{ message: 'Your Email/Username and password is Incorrect' }
               });
            }

            if(compare){
                jwt.sign({ username, is_admin, user_id, email},
                            process.env.TOKEN_SECRET, { expiresIn: '365d' }, (err, token) => {
                              res.status(201).json({
                                data: {
                                  token, 
                                  user: result.rows
                                }
                              });
                            });
                        
            }else{
                res.status(404).json({
                    data:{
                        message: 'Your Email/Username and password is Incorrect'
                    }
                })
            }
            }catch (error) {
            res.status(500).json({
                data:{
                    status: 'error',
                    message: 'Something went Wrong'
                }
            })
        }
    }
}

module.exports = UserCtrl;