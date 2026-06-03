const express = require("express");
const Fault = require("../models/Fault");
const Complaint = require("../models/Complaint");
const Bill = require("../models/Bill");
const PowerStatus = require("../models/PowerStatus");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const [faults, complaints, bills, phases] = await Promise.all([
    Fault.countDocuments({ status: { $ne: "Resolved" } }),
    Complaint.countDocuments({ status: { $ne: "Resolved" } }),
    Bill.countDocuments({ status: "Pending" }),
    PowerStatus.find(),
  ]);

  const powerOffCount = phases.filter((item) => item.state === "OFF").length;

  res.json({
    openFaults: faults,
    openComplaints: complaints,
    pendingBills: bills,
    powerOffPhases: powerOffCount,
  });
}));

module.exports = router;
