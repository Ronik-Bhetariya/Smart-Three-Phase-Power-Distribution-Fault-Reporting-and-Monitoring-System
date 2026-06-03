const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    complaintType: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Received", "Under Review", "Resolved"],
      default: "Received",
    },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
