const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/database_changed");
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
        
        const {

            first_name, 
            last_name, 
            date_of_birth, 
            email, 
            phone_number, 
            gender, 
            username, 
            is_admin, 
            avatar_url, 
            password
        } = req.body;
        
        try {
            // Generate the salt
            let salt = await bcrypt.genSalt(10);
            
            // Generate the hast with the salt
             const hash = await bcrypt.hash(password, salt);
          

            // Check if the hash is truthy
            if (hash) {

                // Check if the email exists in the database 
                let resultCheck = await pool.query("SELECT email user_name FROM users WHERE email=$1", [email]);

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
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
                    // console.log(userEmail, "3")
                    const values = [
                        first_name,
                        last_name,
                        email,
                        date_of_birth,
                        avatar_url,
                        is_admin,
                        hash,
                        phone_number,
                        gender,
                        username
                    ];

                    // Query the database to insert the records
                    const response = await pool.query(query, values);
                
                    // const {user_id} = response.rows[0];
                    // const {email} = response.rows[0];
                    // const {is_admin} = response.rows[0];
                    // const {user_name} = response.rows[0];
                    
                    if ( response.rowCount > 0) {
                        return res.status(201).json({
                            data: {
                                status: "success",
                                message: "User created successfully"
                            }
                        });
                    }

                    return res.status(404).json({
                        data: {
                            status: "error",
                            message: "Unable to Signup"
                        }
                    })
                
                //Sign the value in JWT Token to expire in a year, just hope it is not a leap year 🤣

                // jwt.sign({ user_name, is_admin , email, user_id}, process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                //         if(err){
                //             res.status(400).json({
                //                 message: "Unable to generate Token"
                //             });
                //         }
                //         res.status(201).json({
                //             data: {
                //                 token: token,
                //                 status: "success", 
                //                 message: "User created successfully",
                //         }
                //     });
                // });
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
            const {email, password} = req.body;
            // console.log(email, password)

            // Check if email exists in the DB
            let result = await pool.query(`SELECT user_id, email, is_admin, 
            password, user_name FROM users WHERE email=$1`, [email]);
            // console.log(result.rows[0])

            let {user_id, is_admin, user_name:username} = result.rows[0];
            // let email = result.rows[0].email; 

            // console.log(user_id, is_admin, username, email)

            // Database hash
            // console.log(result.rows[0].password)
            const dbPasswordHash = result.rows[0].password;

            // Compare both hashes to check validity
            const compare = await bcrypt.compare(password, dbPasswordHash);
            
            // Checks if email already exists in DB
            if(result.rowCount <= 0){
               res.status("404").json({
                   status: "error",
                   message: "Your Email/Username and password is Incorrect" 
               });
            }else if(compare){
                jwt.sign({ email, username, is_admin, user_id }, process.env.TOKEN_SECRET, { expiresIn: "365d" }, (err, token) => {
                    if (err){
                        // console.log('enter wrongly')
                        res.status(404).json({
                            status: "error",
                            message: "Unable to generate token"
                        })
                    }else{
                        res.status(200).json({
                            status: "success",
                            data: {
                                token,
                                user_id,
                                message: "You have logged in successfully",
                            }
                        });
                    }
                });
            }else {
                res.status(404).json({
                data:{
                    message: "Your Email/Username and password is Incorrect"
                }
             })
            }
        }catch (error) {
            // console.log(error)
            res.status(500).json({
                data:{
                    status: "error",
                    message: "Something went Wrong",
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
        
            // const userId = req.params.userId;
            const userId = req.id;
            const query = `SELECT first_name, last_name, email, date_of_birth, avatar_url, 
                           phone_number, gender, user_name FROM users WHERE user_id=$1`;

            const result = await pool.query( query, [userId]);
            // console.log(result.rows)

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

    static async editProfile(req, res) {      
        const { email, phone_number } = req.body;
        console.log(email, phone_number, req.id)
        
        const result = await pool.query('SELECT email, phone_number from users WHERE user_id=$1', [req.id]);
        console.log(result.rows);
        
        try {
            if (result.rowCount > 0){
                if (result.rows[0].email !== email && result.rows[0].phone_number !== phone_number) {
                    const result1 = await pool.query('UPDATE users SET email=$1, phone_number=$2 WHERE user_id=$3', [email, phone_number, req.id]);
                    if (result1.rowCount > 0) {
                        return res.status(200).json({
                            status: 'success',
                            message: 'User Successfully Updated'
                        });
                    }

                    return res.status(404).json({
                        status: 'error',
                        message: 'User not Successfully Updated'
                    });
                }else if (result.rows[0].email !== email) {
                    const result2 = await pool.query('UPDATE users SET email=$1 WHERE user_id=$2', [email, req.id]);
                    if (result2.rowCount > 0) {
                        return res.status(200).json({
                            status: 'success',
                            message: 'User Successfully Updated'
                        });
                    }

                    return res.status(404).json({
                        status: 'error',
                        message: 'User not Successfully Updated'
                    });
                }else if (result.rows[0].phone_number !== phone_number) {
                    const result3 = await pool.query('UPDATE users SET phone_number=$1 WHERE user_id=$2', [phone_number, req.id]);
                    if (result3.rowCount > 0) {
                        return res.status(200).json({
                            status: 'success',
                            message: 'User Successfully Updated'
                        });
                    }

                    return res.status(404).json({
                        status: 'success',
                        message: 'User Successfully Updated'
                    });
                
            }
        }else{
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            }); 
        }
    }catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Something Unexpected Happened',
            error
        })
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

            const result =  pool.query("SELECT email FROM users WHERE email=$1", [email]);

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
                    from: process.env.SENDER_EMAIL,
                    to: email,
                    subject: "Reset Password Link - Devstory",
                    text: `<p>You requested to reset your password. 
                    Click <a href="https://devssstory.netlify.app/user/changepassword?token=${token}">here</a> to reset it</p><br/>
                    <p>This token will expire in 15 minutes</p><p>Pls, ignore if you are not the one</p>. <p>Contact mail us @ devstory@gmail.com for help</p>`
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
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            if (hash) {
                const result = await pool.query("UPDATE users SET password=$1  WHERE user_id=$2", [hash, req.id]);
                
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
            const {oldPassword} = req.body;
            const {retryNewPassword} = req.body
            if (oldPassword && retryNewPassword) {
                const result = await pool.query("SELECT password FROM users WHERE user_id=$1", [req.id]);
                if (result.rowCount > 0) {
                    const compare = await bcrypt.compare(oldPassword, result.rows[0].password);
                    if (compare) {
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(retryNewPassword, salt)
                        
                        if (hash) {
                            const result = await pool.query("UPDATE users SET password=$1 WHERE user_id=$2", [hash, req.id]);
                            if (result.rowCount > 0) {
                                res.status(200).json({
                                    status: "success",
                                    message: "Your password has been changed successfully"
                                });
                            }else{
                                res.status(404).json({
                                    status: "error",
                                    message: "Password has not been changed"
                                });
                            }
                        }
                    } else{
                        res.status(404).json({
                            status: "error",
                            message: "Password is not correct"
                        });
                    }
                }else {
                    res.status(404).json({
                        status: "error",
                        message: "Account doesn't exists"
                    });
                }
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