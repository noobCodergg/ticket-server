const mongoose = require("mongoose");

const legSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  transportType: { type: String, required: true },
  notes: { type: String },
});

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    legs: [legSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("trips", tripSchema);

