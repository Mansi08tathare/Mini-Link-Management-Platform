const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();
const authMiddleware = (req, res, next) => {
    // console.log(process.env.JWT_SECRET, "jwt");
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract the actual token

    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT Error:", err.message);
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;