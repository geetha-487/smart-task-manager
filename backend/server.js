const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEMP STORAGE
let users = [];
let tasks = [];

// HOME
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// ================= REGISTER =================
app.post("/auth/register", (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find(
    (u) => u.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      msg: "User already exists",
    });
  }

  users.push({
    email,
    password,
  });

  res.json({
    msg: "Register Success",
  });
});

// ================= LOGIN =================
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) =>
      u.email === email &&
      u.password === password
  );

  if (!user) {
    return res.status(400).json({
      msg: "Invalid credentials",
    });
  }

  res.json({
    token: "dummy-token",
  });
});

// ================= GET TASKS =================
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ================= ADD TASK =================
app.post("/tasks", (req, res) => {

  const { title, priority, dueDate } = req.body;

  const newTask = {
    _id: Date.now().toString(),
    title,
    priority,
    dueDate,
    status: "To Do",
  };

  tasks.push(newTask);

  res.json(newTask);
});

// ================= UPDATE TASK =================
app.put("/tasks/:id", (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  tasks = tasks.map((task) =>
    task._id === id
      ? { ...task, status }
      : task
  );

  res.json({
    msg: "Task Updated",
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});	