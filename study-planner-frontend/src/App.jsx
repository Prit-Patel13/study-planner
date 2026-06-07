import "./App.css";
import { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { ToastContainer } from "react-toastify";

function App() {
  const [editingTask, setEditingTask] = useState(null);

  return (
    <>
      <div className="app">
        <div className="overlay">
          <h1>📚 Study Planner</h1>

          <div className="dashboard">
            <div className="left-panel">
              <TaskForm
                editingTask={editingTask}
                setEditingTask={setEditingTask}
              />
            </div>

            <div className="right-panel">
              <TaskList
                setEditingTask={setEditingTask}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
      />
    </>
  );
}

export default App;