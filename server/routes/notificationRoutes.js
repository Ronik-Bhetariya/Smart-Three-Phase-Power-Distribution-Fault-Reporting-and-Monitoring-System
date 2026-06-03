const express = require("express");
const Notification = require("../models/Notification");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
}));

router.post("/seed", asyncHandler(async (req, res) => {
  const existing = await Notification.find();
  if (existing.length) {
    return res.status(400).json({ message: "Notifications already seeded" });
  }

  await Notification.insertMany([
    {
      title: "Scheduled Maintenance",
      message: "Line maintenance in Sector 11 from 2 PM to 4 PM.",
      priority: "Warning",
    },
    {
      title: "Heavy Fault Alert",
      message: "Multiple critical faults reported in East Zone.",
      priority: "Urgent",
    },
  ]);

  res.json({ message: "Notifications seeded" });
}));

module.exports = router;
