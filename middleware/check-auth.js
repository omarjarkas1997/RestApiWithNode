const { verify } = require("jsonwebtoken");

const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log("The token is ", token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
    }catch (err){
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }
    next();
}


module.exports = verifyToken;