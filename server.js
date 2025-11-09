require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const gigRoutes = require("./routes/gigs");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Log every request
app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "🎓 StudentGig backend is running successfully!" });
});

// ✅ Mount routes
app.use("/api", authRoutes);
app.use("/api", gigRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
