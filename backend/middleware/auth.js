const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticate = async (req, res, next) => {
  // 1. Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user exists
    const { rows } = await db.query(
      "SELECT id, email FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4. Attach user to request
    req.user = rows[0];
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
