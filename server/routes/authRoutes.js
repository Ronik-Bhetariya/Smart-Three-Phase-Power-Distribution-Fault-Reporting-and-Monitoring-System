const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/seed-admin", asyncHandler(async (req, res) => {
  const existingAdmin = await User.findOne({ email: "admin@powerboard.com" });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "System Admin",
    email: "admin@powerboard.com",
    password: hashedPassword,
    role: "admin",
  });

  res.json({ message: "Admin user seeded successfully" });
}));

router.post("/admin-login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "admin" });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, admin: { name: user.name, email: user.email } });
}));

module.exports = router;
