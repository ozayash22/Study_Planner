// src/components/TaskModal.jsx
import React, { useState, useEffect } from "react";

const TaskModal = ({ onClose, onSave, mode = "add", initialData = null }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "LOW",
    dueDate: "",
    status: "TODO",
  });

  useEffect(() => {
    if (initialData) {
      setTask(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(task);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Task" : "Add New Task"}
        </h2>

        <input
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task title"
          className="w-full mb-3 px-4 py-2 border rounded"
        />
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-3 px-4 py-2 border rounded"
        />
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {mode === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
