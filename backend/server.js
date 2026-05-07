require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ MUST be before routes
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

// TEST
app.get("/", (req, res) => {
  res.send("API Running");
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB ERROR:", err.message));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});