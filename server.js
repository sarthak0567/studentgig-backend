require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const gigRoutes = require("./routes/gigs");

const app = express();

// ✅ Enable CORS for Netlify frontend
app.use(
  cors({
    origin: ["https://wonderful-sunburst-baabf1.netlify.app"], // your live frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Optional logging for debug
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api", gigRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 StudentGig backend is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
