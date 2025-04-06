import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// Bcrypt functions for hashing and comparing passwords
const hashedPassword = (password) => {
  // If the password already appears to be a bcrypt hash, return it.
  if (password.startsWith('$2')) {
    return Promise.resolve(password);
  }
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// JWT middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token

  try {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded token:", verified);
  if (!verified.role) {
    console.error("Token missing role claim");
    return res.status(403).json({ message: "Token missing required claims" });
  }
  req.user = verified; // Store decoded token payload (user data) in request object
    next(); // Proceed to next middleware
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user has the required role
 const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;  // This gets the role from the decoded JWT token
    console.log("Decoded user role:", userRole);  // Debugging line
    console.log("Allowed roles for this route:", allowedRoles);  // Debugging line

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    next();
  };
};


export { hashedPassword, comparePassword, verifyToken, checkRole };
