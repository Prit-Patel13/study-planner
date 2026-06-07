const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const studyTask = require("./models/studyTask");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Study Planner API");
});

app.post("/api/tasks", async (req, res) => {
  const task = await studyTask.create(req.body);
  return res.status(201).json({
    msg: "Task Created Successfully",
    task,
  });
});

app.get("/api/tasks", async (req, res) => {
  const tasks = await studyTask.find({});
  return res.json(tasks);
});

app.get("/api/tasks/:id", async (req, res) => {
  const task = await studyTask.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      msg: "Task Not Found",
    });
  }

  return res.json(task);
});

app.patch("/api/tasks/:id", async (req, res) => {
  const task = await studyTask.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({
      msg: "Task Not Found",
    });
  }

  return res.json({
    msg: "Task Updated Successfully",
    task,
  });
});

app.delete("/api/tasks/:id", async (req, res) => {
  const task = await studyTask.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      msg: "Task Not Found",
    });
  }

  return res.json({
    msg: "Task Deleted Successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});