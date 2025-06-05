const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

function loadTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE);
    tasks = JSON.parse(data);
  } catch (err) {
    tasks = [];
  }
}

function saveTasks() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

loadTasks();

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = req.body.completed;
  saveTasks();
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  saveTasks();
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(
    `Task Manager API by Yabsira Dejene running on http://localhost:${PORT}`
  );
});
