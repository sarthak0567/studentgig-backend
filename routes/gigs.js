const express = require("express");
const db = require("../db");
const router = express.Router();

// Fetch all gigs
router.get("/gigs", (req, res) => {
  const gigs = db.prepare("SELECT * FROM gigs ORDER BY id DESC").all();
  res.json(gigs);
});

// Fetch gigs by category or search
router.get("/gigs/search", (req, res) => {
  const { category, q } = req.query;
  let query = "SELECT * FROM gigs WHERE 1=1";
  const params = [];

  if (category && category !== "All") {
    query += " AND category=?";
    params.push(category);
  }

  if (q) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  const gigs = db.prepare(query).all(...params);
  res.json(gigs);
});

// Post a new gig
router.post("/gigs", (req, res) => {
  try {
    const { title, category, price, duration, description, posted_by = null } = req.body;
    if (!title || !category || !price || !duration || !description)
      return res.status(400).json({ error: "All fields required" });

    const stmt = db.prepare(
      "INSERT INTO gigs (title, category, price, duration, description, posted_by) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(title, category, price, duration, description, posted_by);
    res.json({ message: "Gig posted successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error posting gig" });
  }
});

// Apply for a gig
router.post("/gigs/:id/apply", (req, res) => {
  try {
    const { user_id } = req.body;
    const gig_id = req.params.id;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const stmt = db.prepare(
      "INSERT OR IGNORE INTO applications (user_id, gig_id) VALUES (?, ?)"
    );
    stmt.run(user_id, gig_id);
    res.json({ message: "Applied successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: "Error applying for gig" });
  }
});

// Save a gig
router.post("/gigs/:id/save", (req, res) => {
  try {
    const { user_id } = req.body;
    const gig_id = req.params.id;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const stmt = db.prepare(
      "INSERT OR IGNORE INTO saved_gigs (user_id, gig_id) VALUES (?, ?)"
    );
    stmt.run(user_id, gig_id);
    res.json({ message: "Gig saved successfully ❤️" });
  } catch (err) {
    res.status(500).json({ error: "Error saving gig" });
  }
});

module.exports = router;
