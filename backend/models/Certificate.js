const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  title: String,
  issuedBy: String,
  issueDate: Date,
  certificateUrl: String,
  description: String,
});

module.exports = mongoose.model("Certificate", certificateSchema);
