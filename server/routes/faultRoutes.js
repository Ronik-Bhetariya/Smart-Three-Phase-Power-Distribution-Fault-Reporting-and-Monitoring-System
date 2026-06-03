const express = require("express");
const Fault = require("../models/Fault");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

const createFaultId = () =>
  `FLT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

router.post("/", asyncHandler(async (req, res) => {
  const fault = await Fault.create({
    ...req.body,
    faultId: createFaultId(),
  });
  res.status(201).json(fault);
}));

router.get("/", asyncHandler(async (req, res) => {
  const faults = await Fault.find().sort({ createdAt: -1 });
  res.json(faults);
}));

router.get("/track", asyncHandler(async (req, res) => {
  const { faultId, phone } = req.query;

  if (!faultId && !phone) {
    return res.status(400).json({ message: "Provide faultId or phone number" });
  }

  if (faultId) {
    const fault = await Fault.findOne({ faultId: faultId.trim() });
    if (!fault) {
      return res.status(404).json({ message: "Fault not found" });
    }
    return res.json({ mode: "faultId", results: [fault] });
  }

  const faults = await Fault.find({ phone: phone.trim() }).sort({ createdAt: -1 });
  if (!faults.length) {
    return res.status(404).json({ message: "No faults found for this phone number" });
  }
  return res.json({ mode: "phone", results: faults });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const fault = await Fault.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fault) {
    return res.status(404).json({ message: "Fault not found" });
  }
  res.json(fault);
}));

module.exports = router;
