import { useEffect, useState } from "react";
import API from "../services/taskApi";
import { toast } from "react-toastify";

function TaskList({ setEditingTask }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };
   

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    await API.delete(`/${id}`);

    toast.error("🗑 Task Deleted Successfully");

    fetchTasks();
  } catch (err) {
    console.error(err);

    toast.error("❌ Delete Failed");
  }
};
const markCompleted = async (id) => {
  try {
    await API.patch(`/${id}`, {
      status: "Completed",
    });

    toast.success("🎉 Task Completed");

    fetchTasks();
  } catch (err) {
    console.error(err);

    toast.error("❌ Update Failed");
  }
};
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.subject
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      task.topic
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? task.status === "Completed"
        : task.status !== "Completed";

    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks];

  if (sortBy === "Newest") {
    sortedTasks.reverse();
  }

  if (sortBy === "Priority") {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    sortedTasks.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalTasks}</h3>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h3>{completedTasks}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h3>{pendingTasks}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h3>{highPriorityTasks}</h3>
          <p>High Priority</p>
        </div>
      </div>

      <h2 className="section-title">Study Tasks</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search by subject or topic..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-buttons">
        <button
          className={filter === "All" ? "active-filter" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>

        <button
          className={filter === "Pending" ? "active-filter" : ""}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>

        <button
          className={filter === "Completed" ? "active-filter" : ""}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
      </div>

      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="Newest">Newest First</option>
        <option value="Oldest">Oldest First</option>
        <option value="Priority">Priority</option>
      </select>

      <div className="progress-container">
        <div className="progress-info">
          <span>
            {completedTasks} / {totalTasks} Completed
          </span>

          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="task-grid">
        {sortedTasks.map((task) => (
          <div
            key={task._id}
            className={`task-card ${
              task.status === "Completed"
                ? "completed-card"
                : ""
            }`}
          >
            <h3>{task.subject}</h3>

            <p>{task.topic}</p>

            <p>
              📅 Start:{" "}
              {new Date(
                task.startDate
              ).toLocaleDateString("en-GB")}
            </p>

            <p>
              ⏳ Deadline:{" "}
              {new Date(
                task.deadline
              ).toLocaleDateString("en-GB")}
            </p>

            <span
              className={`priority-badge ${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>

            <p>Status: {task.status}</p>

            <div className="btn-group">
              <button
                className={
                  task.status === "Completed"
                    ? "completed-btn"
                    : "complete-btn"
                }
                disabled={
                  task.status === "Completed"
                }
                onClick={() =>
                  markCompleted(task._id)
                }
              >
                {task.status === "Completed"
                  ? "Completed"
                  : "Complete"}
              </button>

              <button
  className="edit-btn"
  disabled={task.status === "Completed"}
  onClick={() => setEditingTask(task)}
>
  Edit
</button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteTask(task._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TaskList;