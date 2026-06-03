const express = require("express");
const PowerStatus = require("../models/PowerStatus");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

const mapPowerDisplay = (phase) => {
  const now = new Date();
  const hasWindow = phase.scheduleEnabled && phase.scheduleStart && phase.scheduleEnd;
  const inWindow =
    hasWindow && now >= new Date(phase.scheduleStart) && now <= new Date(phase.scheduleEnd);
  const effectiveState = hasWindow ? (inWindow ? "ON" : "OFF") : phase.state;
  const faultMessage =
    effectiveState === "OFF" ? "In this phase there is some fault." : "No active fault.";

  return {
    ...phase.toObject(),
    state: effectiveState,
    powerWindow: hasWindow
      ? `${new Date(phase.scheduleStart).toLocaleString()} to ${new Date(phase.scheduleEnd).toLocaleString()}`
      : "No schedule active",
    isWithinWindow: Boolean(inWindow),
    faultMessage,
  };
};

router.get("/", asyncHandler(async (req, res) => {
  const phases = await PowerStatus.find().sort({ phase: 1 });
  res.json(phases.map(mapPowerDisplay));
}));

router.post("/seed", asyncHandler(async (req, res) => {
  const existing = await PowerStatus.find();
  if (existing.length) {
    return res.status(400).json({ message: "Power data already exists" });
  }

  const initialData = [
    { phase: "R", voltage: 230, state: "ON", frequency: 50, scheduleEnabled: false },
    { phase: "Y", voltage: 228, state: "ON", frequency: 50, scheduleEnabled: false },
    { phase: "B", voltage: 231, state: "ON", frequency: 50, scheduleEnabled: false },
  ];
  await PowerStatus.insertMany(initialData);
  res.json({ message: "Power status seeded successfully" });
}));

router.post("/schedule-window", asyncHandler(async (req, res) => {
  const start = new Date(req.body?.startTime);
  const end = new Date(req.body?.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid start time or end time" });
  }
  if (end <= start) {
    return res.status(400).json({ message: "End time must be after start time" });
  }

  await PowerStatus.updateMany(
    {},
    {
      $set: {
        scheduleEnabled: true,
        scheduleStart: start,
        scheduleEnd: end,
      },
    }
  );

  const phases = await PowerStatus.find().sort({ phase: 1 });
  res.json({
    message: "Power time window applied for all three phases",
    scheduleStart: start,
    scheduleEnd: end,
    phases: phases.map(mapPowerDisplay),
  });
}));

router.put("/:phase", asyncHandler(async (req, res) => {
  const updated = await PowerStatus.findOneAndUpdate(
    { phase: req.params.phase.toUpperCase() },
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Phase not found" });
  }

  res.json(mapPowerDisplay(updated));
}));

module.exports = router;
