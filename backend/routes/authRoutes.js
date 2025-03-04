import express from 'express';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get("/verify-token", (req, res) => { // ✅ Use authRouter instead of router
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });

        res.status(200).json({ message: "Token is valid", user: decoded });
    });
});

export default authRouter;
