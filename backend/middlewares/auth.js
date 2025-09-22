// src/middleware/auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashedPassword = (password) => {
  if (!password) return Promise.resolve("");
  if (password.startsWith("$2")) return Promise.resolve(password);
  return bcrypt.genSalt(12).then(salt => bcrypt.hash(password, salt));
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.role) {
      return res.status(403).json({ message: "Token missing required claims" });
    }
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authMiddleware = verifyToken;

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
