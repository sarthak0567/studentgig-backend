const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const JWT_SECRET = "supersecret123"; // move to .env later

/* ===========================
   REGISTER USER (Full version)
=========================== */
router.post("/register", async (req, res) => {
  console.log("🧾 Incoming register body:", req.body);

  const { firstName, lastName, email, password, country } = req.body;
  if (!firstName || !lastName || !email || !password || !country) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existing) {
      return res.status(400).json({ message: "❌ User already exists!" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Combine full name
    const fullName = `${firstName} ${lastName}`;

    // Insert new user
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, skills) VALUES (?, ?, ?, ?)"
    );
    stmt.run(fullName, email, hashed, country); // Using `skills` column for country

    res.json({ message: "✅ Registered successfully!" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/* ===========================
   LOGIN USER
=========================== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user)
      return res.status(401).json({ message: "❌ Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "❌ Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "✅ Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
