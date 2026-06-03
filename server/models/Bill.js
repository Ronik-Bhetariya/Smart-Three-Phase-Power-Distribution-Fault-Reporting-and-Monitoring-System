const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    consumerNumber: { type: String, required: true, trim: true },
    consumerName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    billMonth: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    transactionId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
