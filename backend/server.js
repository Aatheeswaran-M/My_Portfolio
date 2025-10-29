const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

// Import Models
const Profile = require("./models/Profile");
const Project = require("./models/Project");
const Certificate = require("./models/Certificate");
const Resume = require("./models/Resume");

const portfolioRoutes = require("./routes/portfolioRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", portfolioRoutes);

// Combined API endpoint
app.get("/api/portfolio", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const projects = await Project.find();
    const certificates = await Certificate.find();
    const resume = await Resume.findOne();

    res.json({
      profile,
      projects,
      certificates,
      resume
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
