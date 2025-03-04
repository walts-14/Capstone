import jwt from 'jsonwebtoken';

  const verifyToken = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(verifyToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Token is valid", user: decoded });
  });

export default verifyToken;