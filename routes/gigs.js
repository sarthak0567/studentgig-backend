const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");

// ✅ GET all gigs
router.get("/gigs", async (req, res) => {
  try {
    const gigs = db.prepare("SELECT * FROM gigs ORDER BY id DESC").all();
    res.json(gigs);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    res.status(500).json({ message: "Server error fetching gigs" });
  }
});

// ✅ POST a new gig (protected)
router.post("/gigs", verifyToken, async (req, res) => {
  const { title, description, category, price } = req.body;
  if (!title || !description || !category || !price)
    return res.status(400).json({ message: "All fields are required" });

  try {
    db.prepare(
      "INSERT INTO gigs (title, description, category, price, created_by) VALUES (?,?,?,?,?)"
    ).run(title, description, category, price, req.user.email);

    res.json({ message: "✅ Gig posted successfully!" });
  } catch (err) {
    console.error("Error posting gig:", err);
    res.status(500).json({ message: "Server error posting gig" });
  }
});

module.exports = router;
