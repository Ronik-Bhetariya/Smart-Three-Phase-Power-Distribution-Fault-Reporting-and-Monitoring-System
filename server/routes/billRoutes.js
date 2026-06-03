const express = require("express");
const Bill = require("../models/Bill");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { consumerNumber, consumerName, amount, dueDate, billMonth } = req.body;
  const bill = await Bill.create({
    consumerNumber,
    consumerName,
    amount,
    dueDate,
    billMonth,
    status: "Pending",
  });
  res.status(201).json(bill);
}));

router.post("/seed", asyncHandler(async (req, res) => {
  const existing = await Bill.find();
  if (existing.length) {
    return res.status(400).json({ message: "Sample bills already created" });
  }

  await Bill.insertMany([
    {
      consumerNumber: "1002003001",
      consumerName: "Rahul Sharma",
      amount: 1250,
      dueDate: "2026-05-10",
      billMonth: "April 2026",
    },
    {
      consumerNumber: "1002003002",
      consumerName: "Priya Verma",
      amount: 890,
      dueDate: "2026-05-12",
      billMonth: "April 2026",
    },
  ]);

  res.json({ message: "Sample bills seeded" });
}));

router.get("/:consumerNumber", asyncHandler(async (req, res) => {
  const bill = await Bill.findOne({ consumerNumber: req.params.consumerNumber }).sort({
    createdAt: -1,
  });
  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }
  res.json(bill);
}));

router.post("/pay/:id", asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) {
    return res.status(404).json({ message: "Bill not found" });
  }
  if (bill.status === "Paid") {
    return res.status(400).json({ message: "Bill already paid" });
  }

  bill.status = "Paid";
  bill.transactionId = `TXN-${Date.now()}`;
  await bill.save();
  res.json(bill);
}));

module.exports = router;
