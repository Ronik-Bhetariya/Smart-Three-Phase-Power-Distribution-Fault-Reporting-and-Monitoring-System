const mongoose = require("mongoose");

const powerStatusSchema = new mongoose.Schema(
  {
    phase: {
      type: String,
      enum: ["R", "Y", "B"],
      required: true,
      unique: true,
    },
    voltage: { type: Number, required: true },
    state: { type: String, enum: ["ON", "OFF"], default: "ON" },
    frequency: { type: Number, default: 50 },
    scheduleEnabled: { type: Boolean, default: false },
    scheduleStart: { type: Date, default: null },
    scheduleEnd: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PowerStatus", powerStatusSchema);
