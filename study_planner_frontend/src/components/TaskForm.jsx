import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const TaskForm = ({ task: initialTask, onTaskUpdate }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "LOW",
    dueDate: "",
  });
  const [isEditing, setIsEditing] = useState(!initialTask);

  useEffect(() => {
    if (initialTask) {
      setTask({
        ...initialTask,
        dueDate: initialTask.dueDate ? initialTask.dueDate.split('T')[0] : "",
      });
      setIsEditing(false);
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const apiCall = initialTask
      ? axiosInstance.put(`/tasks/${initialTask.id}`, task)
      : axiosInstance.post("/tasks", task);

    try {
      await apiCall;
      onTaskUpdate();
    } catch (err) {
      console.error("Failed to save task", err);
      alert("Error: Could not save the task.");
    }
  };

  const handleDelete = async () => {
    if (!initialTask || !window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(`/tasks/${initialTask.id}`);
      onTaskUpdate();
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Error: Could not delete the task.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{initialTask ? "Task Details" : "Create New Task"}</h2>
        {!isEditing && initialTask && (
          <button onClick={() => setIsEditing(true)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold">Edit</button>
        )}
      </div>

      <div className="flex-grow space-y-4">
        <div>
          <label className="font-semibold text-gray-600">Title</label>
          <input name="title" value={task.title} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border rounded-lg bg-gray-50 disabled:bg-gray-200 disabled:text-gray-600" />
        </div>
        <div>
          <label className="font-semibold text-gray-600">Description</label>
          <textarea name="description" value={task.description} onChange={handleChange} disabled={!isEditing} rows="4" className="w-full mt-1 p-2 border rounded-lg bg-gray-50 disabled:bg-gray-200 disabled:text-gray-600" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-600">Priority</label>
            <select name="priority" value={task.priority} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border rounded-lg bg-gray-50 disabled:bg-gray-200 disabled:text-gray-600">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Due Date</label>
            <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border rounded-lg bg-gray-50 disabled:bg-gray-200 disabled:text-gray-600" />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-between">
          <div>
            {initialTask && (
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete Task</button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if(initialTask) setIsEditing(false); else onTaskUpdate(); }} className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;