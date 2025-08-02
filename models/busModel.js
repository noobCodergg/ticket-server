const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const busSchema = new mongoose.Schema({
  coachNo: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  seatCount: {
    type: Number,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  seats: [seatSchema], // array of seat objects
});

module.exports = mongoose.model("Bus", busSchema);
