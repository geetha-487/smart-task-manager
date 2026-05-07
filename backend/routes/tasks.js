const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// AUTH
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// ADD TASK
router.post("/", auth, async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    const task = new Task({
      userId: req.user,
      title,
      priority,
      dueDate,
      status: "To Do"
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// GET TASKS
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
  res.json(tasks);
});

// UPDATE STATUS
router.put("/:id", auth, async (req, res) => {
  try {
    console.log("UPDATE HIT:", req.params.id, req.body);

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).send("Not found");

    task.status = req.body.status;

    await task.save();

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;