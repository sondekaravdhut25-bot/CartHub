const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT from the Authorization header and attaches req.user
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

// Must run after `protect` — checks the attached user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(  ).json({ message: "Admin access required" });
};

module.exports = { protect, admin };
