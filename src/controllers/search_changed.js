const pool = require("../models/database_changed");

module.exports = async (req, res) => {
    
    try {
        const {q} = req.query;
        
        const query = "SELECT first_name, last_name, user_name FROM users WHERE first_name=$1 OR last_name=$2 OR user_name=$3";
        const values = [q, q, q];
        const result = await pool.query( query , values); 
       
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
                message: "User not found"
            });
        }
    } catch (error) {
        // console.log(error)
        res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error
        });
    }
}