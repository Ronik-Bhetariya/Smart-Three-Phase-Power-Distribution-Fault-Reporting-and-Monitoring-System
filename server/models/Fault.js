const mongoose = require("mongoose");

const faultSchema = new mongoose.Schema(
  {
    faultId: { type: String, required: true, unique: true, trim: true },
    reporterName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: "" },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Reported", "Assigned", "In Progress", "Resolved"],
      default: "Reported",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fault", faultSchema);
