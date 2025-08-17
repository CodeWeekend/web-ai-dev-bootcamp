import React, { useState, useEffect } from "react";
import "./App.css";

// TaskForm Component: Handles the form for adding tasks
function TaskForm({ onAddTask }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task);
      setTask(""); // Clear the input field after adding
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
        className="task-input"
      />
      <button type="submit" className="task-button">
        Add Task
      </button>
    </form>
  );
}

// TaskList Component: Displays the list of tasks
function TaskList({ tasks, onToggleComplete }) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`task-item ${task.completed ? "completed" : ""}`}
          onClick={() => onToggleComplete(index)}
        >
          {task.text}
        </li>
      ))}
    </ul>
  );
}

// Main App Component
function App() {
  const [tasks, setTasks] = useState([]); // State to manage tasks
  const [message, setMessage] = useState(""); // State to manage feedback message

  // Effect to show a message when a task is added
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const addTask = (taskText) => {
    setTasks([...tasks, { text: taskText, completed: false }]);
    setMessage("Task added successfully!");
  };

  const toggleComplete = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="app">
      <h1>To-do List</h1>
      <TaskForm onAddTask={addTask} />
      {message && <p className="message">{message}</p>}
      <TaskList tasks={tasks} onToggleComplete={toggleComplete} />
    </div>
  );
}

export default App;
