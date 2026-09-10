const jwt = require("jsonwebtoken");

// Signs a JWT containing just the user id. Kept minimal on purpose —
// look the rest of the user up from the DB on each request rather than
// trusting a stale payload.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
