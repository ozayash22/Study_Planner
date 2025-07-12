// src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await axiosInstance.put(`/tasks/${selectedTask.id}`, taskData);
      } else {
        await axiosInstance.post("/tasks", taskData);
      }
      setShowModal(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Task save failed:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found. Add one!</p>
      ) : (
        tasks
          .filter((task) => task.status) // ensures status exists
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => {
                setSelectedTask(t);
                setShowModal(true);
              }}
              onStatusChange={handleStatusChange}
            />
          ))
      )}

      {showModal && (
        <TaskModal
          mode={selectedTask ? "edit" : "add"}
          initialData={selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks;
