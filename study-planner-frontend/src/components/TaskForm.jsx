import { useState, useEffect } from "react";
import API from "../services/taskApi";
import { toast } from "react-toastify";

function TaskForm({ editingTask, setEditingTask }) {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    startDate: "",
    deadline: "",
    priority: "Medium",
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        subject: editingTask.subject,
        topic: editingTask.topic,
        startDate: editingTask.startDate?.split("T")[0],
        deadline: editingTask.deadline?.split("T")[0],
        priority: editingTask.priority,
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
     
    try {
      if (editingTask) {
        await API.patch(`/${editingTask._id}`, formData);

        toast.info("✏️ Task Updated Successfully");

        setEditingTask(null);
      } else {
        await API.post("/", formData);

        toast.success("✅ Task Added Successfully");
      }

      setFormData({
        subject: "",
        topic: "",
        startDate: "",
        deadline: "",
        priority: "Medium",
      });

    //   window.location.reload();
    } catch (err) {
      console.error(err);

      toast.error("❌ Something went wrong");
    }
  };

  return (
    <>
      <h2 className="section-title">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="subject"
          placeholder="📚 Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <input
          type="text"
          name="topic"
          placeholder="📝 Topic"
          value={formData.topic}
          onChange={handleChange}
        />

        <div className="input-group">
          <span className="input-tag">📅 Start Date</span>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <span className="input-tag">⏳ Deadline</span>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <span className="input-tag">🚩 Priority</span>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <button type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
    </>
  );
}

export default TaskForm;