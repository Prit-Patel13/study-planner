const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongoDB = require("./config/db");
const studyTask = require("./models/studyTask");

const app = express();
const PORT = 8000;

connectMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected"),
);
app.use(cors());
app.use(express.json());
app.post("/api/tasks", async (req, res) => {
  const body = req.body;
  const task = await studyTask.create({
    subject: body.subject,
    topic: body.topic,
    startDate: body.startDate,
    deadline: body.deadline,
    priority: body.priority,
    status: body.status,
  });
  return res.status(201).json({ msg: "Task Created Successfully", task });
});
app.get("/", (req, res) => {
  res.send("Welcome to Study Planner API");
});
app.get("/api/tasks", async (req, res) => {
  const tasks = await studyTask.find({});
  return res.json(tasks);
});
app.get("/api/tasks/:id", async (req, res) => {
  const task = await studyTask.findById(req.params.id);
  return res.json(task);
});
app.patch("/api/tasks/:id", async (req, res) => {
  const task = await studyTask.findByIdAndUpdate(req.params.id, req.body);
  return res.json({ msg: "Task Updated Successfully" });
});
app.delete("/api/tasks/:id", async (req, res) => {
  await studyTask.findByIdAndDelete(req.params.id);
  return res.json({
    msg: "Task Deleted Successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});
