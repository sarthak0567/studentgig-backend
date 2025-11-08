require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRoutes = require("./routes/auth"); // ✅ import routes
const gigRoutes = require("./routes/gigs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🎓 StudentGig backend is running successfully!" });
});

app.use(cors());
app.use("/api", authRoutes); // ✅ mount /api routes
app.use("/api", gigRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
