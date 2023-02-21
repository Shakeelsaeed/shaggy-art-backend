const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Schema on Document Structure

const msgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
// Create Model

const Message = new mongoose.model("MESSAGE", msgSchema);

module.exports = Message;
