const pool = require("../models/database");

module.exports = (req, res) => {
    
    try {
        const {author} = req.param
        
        const query = "SELECT first_name, last_name, username FROM users WHERE first_name=$1 OR last_name=$2 OR username";
        const values = [author, author, author];
        const result = pool.query( query , values); 
       
        if (result > 0) {
            res.status(200).json({
                status: "success",
                data: {
                    result: result.rows
                }
            });
        }
    
        res.status(404).json({
            status: "error",
            message: "User not found"
        });
    } catch (error) {
        res.status(500).json({
          status: "error",
          message: "Something went wrong"  
        })
    }
}