const express = require("express");
const Complaint = require("../models/Complaint");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

const createComplaintId = () =>
  `CMP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

router.post("/", asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    complaintId: createComplaintId(),
  });
  res.status(201).json(complaint);
}));

router.get("/track/:complaintId", asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }
  res.json(complaint);
}));

router.get("/", asyncHandler(async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }
  res.json(complaint);
}));

module.exports = router;
