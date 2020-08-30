const jwt = require("jsonwebtoken");
require("dotenv").config();

class Auth{
    /**
     * 
     * @param {Object} req 
     * @param {Object} res
     * @returns JSON
     * @memberof Auth 
     */
    static verifyUser(req, res, next) {
        const token = req.headers["authorization"].split(' ')[1];
        // console.log(token);
        if (!token || token === undefined) {
          return res.status(403).json({
            status: 403,
            error: "You are not Authorize"
          });
        }
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decode) => {
          if (error) {
            return res.status(500).json({ status: 500, error: "Expired Authorization ", error});
          }
          req.user = decode.user_name;
          req.admin = decode.is_admin;
          req.id = decode.id;
          next();
        });
      }
}

module.exports = Auth;