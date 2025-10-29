const express = require("express");
const Profile = require("../models/Profile");
const Certificate = require("../models/Certificate");
const Project = require("../models/Project");
const Resume = require("../models/Resume");

const router = express.Router();

// Profile
router.get("/profile", async (req, res) => {
  const profile = await Profile.findOne();
  res.json(profile);
});

// Certificates
router.get("/certificates", async (req, res) => {
  const certificates = await Certificate.find();
  res.json(certificates);
});

// Projects
router.get("/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Resume
router.get("/resume", async (req, res) => {
  const resume = await Resume.findOne();
  res.json(resume);
});

module.exports = router;
