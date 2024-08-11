const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  Title: {
    type: String,
  },
  Description: {
    type: String,
  },
  Status: {
    type: String,
    enum: ["Completed", "Pending"],
  }
},
{timestamps: true});

module.exports = mongoose.model("Task", taskSchema);
