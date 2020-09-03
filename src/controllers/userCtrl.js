const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/database");
const nodeMailer = require("nodemailer")
require("dotenv").config();

// Sign Up ctrl
class UserCtrl{
    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof UserCtrl
     */
     
     // ! ADD THE DATA TYPE URL TO THE MEDIA TABLE AND ATTR AVATARURL IN POSTGRES
     // User Sign Up
    static async creatUser(req,res){
        const {firstName, lastName, dateOfBirth, user_email, phonenumber, gender, userName, isadmin, avatarUrl, password} = req.body;
    
        try {
            // Generate the salt
            let salt = await bcrypt.genSalt(10);
            
            // Generate the hast with the salt
            let hash = await bcrypt.hash(password,salt);
          

            // Check if the hash is truthy
            if (hash) {

                // Check if the email exists in the database 
                let resultCheck = await pool.query("SELECT email FROM users WHERE email=$1", [user_email]);
                
                if (resultCheck.rowCount > 0){
                    res.status(409).json({
                        status: "error",
                         message: "User already exists with this email"
                    })
                }
                else{
                    // Create the  Query for the the INSERT
                    let query = 
                    `INSERT INTO users(first_name, last_name, email, date_of_birth, avatar_url, 
                    is_admin, password, phone_number, gender, user_name) 
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
                    let values = [firstName, lastName, user_email, dateOfBirth, avatarUrl, isadmin, hash, phonenumber, gender, userName];

                    // Query the database to insert the records
                    let response = await pool.query(query, values);

                    // const {user_id} = response.rows[0];
                    const {email} = response.rows[0];
                    const {is_admin} = response.rows[0];
                    const {user_name} = response.rows[0];

                    jwt.sign({ user_name, is_admin, email, user_id}, process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                            if(err){
                                res.status(400).json({
                                    message: "Unable to generate Token"
                                })
                            }
                            res.status(201).json({
                                data: {
                                    token: token, 
                                    message: "User created successfully",
                                    user: response.rows
                            }
                        });
                    });
                }

                   
            }
        } catch (error) {
            res.status("500").json({
                data: {
                    status: "error",
                    message: "Something  went Wrong",
                    error
                }
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof UserCtrl
     */

    // User login logic
    static async login(req, res){
        try {
            const {loginData, password}= req.body;

            // Check if email exists in the dp
            let result = await pool.query(`SELECT user_id, email, is_admin, 
            password FROM users WHERE email=$1 OR user_name=$1`, [loginData]);
            let email = result.rows[0].email; 

            // Generate hash with password recently by the user
            const salt = await bcrypt.genSalt(10);
        
            // Database hash
            let dbPasswordHash = result.rows[0].password;

            // Compare both hashes to check validity
            let compare = await bcrypt.compare(password, dbPasswordHash);

            if(result.rowCount === 0){
               res.status("404").json({
                   status: "error",
                   message: "Your Email/Username and password is Incorrect" 
               });
            }else if(compare){
                // The issue with this is if the token has expired
                // const token = req.headers["authorization"].split(" ")[1]
                // if (token) {
                //     res.status(200).json({
                //         status: "success",
                //         data:{
                //             message: "You have logged in successfully"
                //         } 
                //     })
                jwt.sign({ username, is_admin, user_id, email},
                    process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                        res.status(201).json({
                        data: {
                            token,
                            message: "You have logged in successfully",
                            user: result.rows
                        }
                        });
                    });
                }else{
                res.status(404).json({
                    data:{
                        message: "Your Email/Username and password is Incorrect"
                    }
                })
            }
        }catch (error) {
            res.status(500).json({
                data:{
                    status: "error",
                    message: "Something went Wrong"
                }
            });
        }
    }

     /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data
     * @memberof UserCtrl
     */

    static async profile(req, res){
        try {
            
            const userId = req.params.userId;
            const query = `SELECT first_name, last_name, email, date_of_birth, avatar_url, is_admin, 
                           password, phone_number, gender, user_name FROM users WHERE email=$1`

            const result = await pool.query( query, [userId]);

            if (result.rowCount > 0) {

                res.status(200).json({
                    status: "success",
                    data: {
                        result: result.rows
                    }
                });
            }else{

                res.status(404).json({
                    status: "error",
                    message: "Unable to fetch user data"
                });
            }
        } catch (error) {

            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data 
     * @memberof UserCtrl
     */

    static async forgotPassword(req, res) {
        try{
            const {email} = req.body;

            const result = pool.query("SELECT email FROM users WHERE email=$1", [email]);

            if ((await result).rowCount > 0) {
                // Create a jwt token which expires in 15mins
                jwt.sign({email, user_id}, process.env.TOKEN_SECRET, {expiresIn: "900s"}, (error, token) => {
                    if (error) {
                        res.status(400).json({
                           status: "error",
                           message: "Unable to generate token" 
                        });
                    }

                    // Create a mail transport
                    let transporter = nodeMailer.createTransport({
                    service: 'smtp.gmail',
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.EMAIL,
                      pass: process.env.EMAIL_PASSWORD
                    }
                });

                  // Mail information for recipient
                  var mailOptions = {
                    from: 'hakanboysidol@gmail.com',
                    to: email,
                    subject: 'Reset Password Link - Devstory',
                    text: `<p>You requested to reset your password. 
                    Click <a href="https://devstory.netlify.app/Politico/changepassword.html?token=${token}">here</a> to reset it</p><br/>
                    <p>This token will expire in 15 minutes</p><p>Pls, ignore if you are not the one</p>. <p>Contact mail us @ politicoxpress@gmail.com for help</p>`
                  };

                  // Send the E-mail
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                });
            }else{

                res.status(404).json({
                    status: "error",
                    message: "No Email associated with Account"
                });
            }
        }catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }

    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data 
     * @memberof UserCtrl
     */

    static async changePassword(req, res) {
        try {
            const {password} = req.body;
            const id = req.id
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            if (hash) {
                const result = await pool.query("UPDATE users SET password=$1  WHERE user_id=$2 RETURNING *", [hash, id]);
                
                if (result.rowCount > 0) {
                    res.setHeader("Content-Encoding", "gzip");
                    res.status(200).json({
                        status: "success",
                        message: "Successfully Changed your password"
                    });
                }

                res.status(404).json({
                    status: "error",
                    message: "Your password could not be changed"
                });
            }
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            });
        }
    }
    
    /**
     * @static
     * @params {Object} req
     * @params {Object} res
     * @returns Appropriate JSON Response with Status and Data 
     * @memberof UserCtrl
     */

    static async resetPassword(req, res) {
        try{
            const id = req.id
            const {oldPassword} = req.body;
            const {retryNewPassword} = req.body
            if (oldPassword && retryNewPassword) {
                const result = await pool.query("SELECT password FROM users WHERE user_id=$1", [id]);
                if (result.rowCount > 0) {
                    const compare = await bcrypt.compare(oldPassword, result.rows[0].password)
                    if (compare) {
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(retryNewPassword, salt)
                        
                        if (hash) {
                            const result = await pool.query("UPDATE users SET password=$1 WHERE user_id=$2", [hash, id]);
                            if (result.rowCount > 0) {
                                res.status(200).json({
                                    status: "success",
                                    message: "Your password has been changed successfully"
                                })
                            }
                            res.status(404).json({
                                status: "error",
                                message: "Password has not been changed"
                            })
                        }
                    } 
                    res.status(404).json({
                        status: "error",
                        message: "Password is not correct"
                    }) 
                }
                res.status(404).json({
                    status: "error",
                    message: "Account doesn't exists"
                })
            }
        }catch (error) {
            res.status(500).json({
                status: "error",
                message: "Something went wrong"
            })
        }
    }
}

module.exports = UserCtrl;