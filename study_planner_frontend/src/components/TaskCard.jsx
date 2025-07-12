// src/components/TaskCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaRegCalendarAlt, FaEdit } from "react-icons/fa";

const TaskCard = ({ task, onStatusChange, onEdit }) => {
  if (!task || typeof task !== "object") {
    return null; // Skip if task is invalid
  }

  const statusColors = {
    TODO: "bg-red-100 text-red-600",
    IN_PROGRESS: "bg-yellow-100 text-yellow-600",
    DONE: "bg-green-100 text-green-600",
  };

  const nextStatus = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "DONE",
    DONE: "TODO",
  };

  const safeStatus = task?.status || "UNKNOWN";
  const formattedStatus = safeStatus.replace(/_/g, " ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 shadow-md flex justify-between items-start mb-4 border"
    >
      <div>
        <h3
          className={`text-lg font-semibold ${
            safeStatus === "DONE" ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {task.title || "Untitled Task"}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {task.description || "No description"}
        </p>

        <div className="flex gap-2 mt-3">
          <span
            className={`text-xs px-2 py-1 rounded ${
              statusColors[safeStatus] || "bg-gray-200 text-gray-600"
            }`}
          >
            {formattedStatus}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
            {task.priority || "LOW"}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FaRegCalendarAlt className="text-blue-500" />
          <span>{task.dueDate || "No date"}</span>
        </div>

        <div className="flex gap-2 mt-2">
          {nextStatus[safeStatus] && (
            <button
              onClick={() => onStatusChange(task.id, nextStatus[safeStatus])}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Mark {nextStatus[safeStatus].replace(/_/g, " ")}
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            <FaEdit />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
