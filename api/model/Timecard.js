const mongoose = require("mongoose");

const timecardSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    min: 1,
  },
  task: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  date: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  duration: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model("Timecard", timecardSchema);
