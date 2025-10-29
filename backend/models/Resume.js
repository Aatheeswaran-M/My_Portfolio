const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  fileUrl: String,
  lastUpdated: Date,
});

module.exports = mongoose.model("Resume", resumeSchema);
