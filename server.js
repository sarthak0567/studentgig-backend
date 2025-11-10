require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth");
const gigRoutes = require("./routes/gigs");

const app = express();

// ✅ CORS setup — allow Netlify frontend to access Render backend
app.use(cors({
  origin: "https://wonderful-sunburst-baabf1.netlify.app", // your Netlify domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Simple logger for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ API routes
app.use("/api", authRoutes);
app.use("/api", gigRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 StudentGig backend is running successfully!");
});

// ✅ Start server (only once)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
