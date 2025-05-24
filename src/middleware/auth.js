const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({msg: "Token nao enviado"})
    }

    const token = authHeader.split("")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }catch(err){
        return res.status(403).json({msg: "Token invalido"});
    }
}

module.exports = verifyToken;