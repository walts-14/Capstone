// src/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import { verifyMagicJwt, consumeMagicTokenByJti } from "../src/services/magicToken.js";
import User from "../models/user.js";

const authRouter = express.Router();

authRouter.get("/verify-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    res.status(200).json({ message: "Token is valid", user: decoded });
  });
});

/**
 * Magic login: verify magic token, consume jti, issue session token, set cookie and redirect to frontend.
 * Example QR URL: https://your-backend.com/api/auth/magic-login?token=...
 */
authRouter.get("/magic-login", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("token required");

    const payload = verifyMagicJwt(token);
    if (!payload || payload.purpose !== "magic-login") {
      return res.status(401).send("invalid or expired token");
    }

    // mark jti used
    const consumed = await consumeMagicTokenByJti(payload.jti);
    if (!consumed) return res.status(401).send("token already used or invalid");

    const user = await User.findById(payload.sub);
    if (!user) return res.status(404).send("user not found");

    // Issue session JWT (your normal auth token)
    const sessionToken = jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.TOKEN_EXPIRY_HOURS || 24}h`,
    });

    // set cookie (httpOnly). In production set secure: true and sameSite as appropriate.
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.TOKEN_EXPIRY_HOURS || 24) * 3600 * 1000,
      sameSite: "lax",
    });

    // redirect to frontend dashboard (frontend should call /api/me to fetch user)
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontend}/dashboard`);
  } catch (err) {
    console.error("magic-login error:", err);
    return res.status(500).send("login failed");
  }
});

export default authRouter;
