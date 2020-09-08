const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/database");
const nodeMailer = require("nodemailer")


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
    static async creatUser(req, res){
        
        const {firstName, lastName, dateOfBirth, userEmail, phonenumber, gender, userName, isAdmin, avatarUrl, password} = req.body;
        // console.log(userEmail, 1)
        try {
            // Generate the salt
            let salt = await bcrypt.genSalt(10);
            
            // Generate the hast with the salt
             const hash = await bcrypt.hash(password, salt);
          

            // Check if the hash is truthy
            if (hash) {

                // Check if the email exists in the database 
                let resultCheck = await pool.query("SELECT email user_name FROM users WHERE email=$1, user_name=$2", [userEmail, userName]);
                // console.log(userEmail, 2);
                
                if (resultCheck.rowCount > 0){
                    res.status(409).json({
                        status: "error",
                         message: "User already exists with this email"
                    });
                }else{
                    // Create the  Query for the the INSERT
                const query =
                `INSERT INTO users(first_name, last_name, email, date_of_birth, avatar_url, 
                is_admin, password, phone_number, gender, user_name) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
                // console.log(userEmail, "3")
                const values = [firstName, lastName, userEmail, dateOfBirth, avatarUrl, isAdmin, hash, phonenumber, gender, userName];

                // Query the database to insert the records
                const response = await pool.query(query, values);
            
                const {user_id} = response.rows[0];
                const {email} = response.rows[0];
                const {is_admin} = response.rows[0];
                const {user_name} = response.rows[0];
                 
                
                // Sign the value in JWT Token to expire in a year, just hope it is not a leap year 🤣
                jwt.sign({ user_name, is_admin , email, user_id}, process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                        if(err){
                            res.status(400).json({
                                message: "Unable to generate Token"
                            });
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
            // let email = result.rows[0].email; 
            
            // Database hash
            // console.log(result.rows[0].password)
            let dbPasswordHash = result.rows[0].password;

            // Compare both hashes to check validity
            let compare = await bcrypt.compare(password, dbPasswordHash);

            if(result.rowCount === 0){
               res.status("404").json({
                   status: "error",
                   message: "Your Email/Username and password is Incorrect" 
               });
            }else if(compare){
                const token = req.headers["authorization"].split(" ")[1];
                if (token) {
                    jwt.verify(token, process.env.TOKEN_SECRET, (error, decode) => {
                        if (error) {
                           res.status(500).json({ status: 500, error: "Expired Authorization ", error});
                        }else {
                            res.status(200).json({
                                data: {
                                    message: "You have logged in successfully"
                                }
                            });
                        }
                    });
                }else {
                    jwt.sign({ loginData }, process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                        console.log(token)
                        if (err){
                            res.status(404).json({
                                status: "error",
                                message: "Unable to generate token"
                            })
                        }
                        res.status(200).json({
                        data: {
                            token,
                            message: "You have logged in successfully",
                            user: result.rows
                        }
                        });
                    });
                    }
                } else{
                    res.status(404).json({
                    data:{
                        message: "Your Email/Username and password is Incorrect"
                    }
                })
            }
        }catch (error) {
            console.log(error)
            res.status(500).json({
                data:{
                    status: "error",
                    message: "Something went Wrong",
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
                    else {
                       // Create a mail transport
                    let transporter = nodeMailer.createTransport({
                    service: "smtp.gmail",
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.EMAIL,
                      pass: process.env.EMAIL_PASSWORD
                    }
                });

                  // Mail information for recipient
                  var mailOptions = {
                    from: "hakanboysido@gmail.com",
                    to: email,
                    subject: "Reset Password Link - Devstory",
                    text: `<p>You requested to reset your password. 
                    Click <a href="https://devstory.netlify.app/Politico/changepassword.html?token=${token}">here</a> to reset it</p><br/>
                    <p>This token will expire in 15 minutes</p><p>Pls, ignore if you are not the one</p>. <p>Contact mail us @ politicoxpress@gmail.com for help</p>`
                  }; 
                
                   // Send the E-mail
                   transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response);
                    }
                  });
                }
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