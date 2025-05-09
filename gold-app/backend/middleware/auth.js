
const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = jwt.verify(token, "my-super-secret-key-1234567890");
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
