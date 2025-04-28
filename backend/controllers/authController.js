const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = {
  register: async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1. Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 2. Save user
      const { rows } = await db.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [email, passwordHash]
      );

      // 3. Generate JWT
      const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ user: rows[0], token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1. Find user
      const { rows } = await db.query(
        "SELECT id, email, password_hash FROM users WHERE email = $1",
        [email]
      );

      if (!rows[0]) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // 2. Verify password
      const isValid = await bcrypt.compare(password, rows[0].password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // 3. Generate JWT
      const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ user: { id: rows[0].id, email: rows[0].email }, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
