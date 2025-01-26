const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();
const authMiddleware = (req,res,next)=>{
    const token = req.headers.authorization;
    console.log("tken",token)
    if(!token){
        return res.status(401).json({message:"This action is not allowed"})
    }
    try{    
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;  //
        console.log("decoded",decoded)
        next();
    }catch(err){
        console.log("err",err)
        res.status(401).json({message:"Invalid Token"})
    }
}

module.exports = authMiddleware;