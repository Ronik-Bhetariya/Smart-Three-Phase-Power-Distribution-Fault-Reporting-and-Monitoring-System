require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Smart Three-Phase Power Distribution API is running",
  });
});

app.use("/api/power", require("./routes/powerRoutes"));
app.use("/api/faults", require("./routes/faultRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid request data" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "Duplicate record already exists" });
  }

  return res.status(500).json({ message: "Server error", error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
