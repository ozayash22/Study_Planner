import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const TaskListItem = ({ task, isSelected, onSelect, onStatusChange }) => {
  const priorityColors = {
    HIGH: 'border-l-red-500',
    MEDIUM: 'border-l-orange-500',
    LOW: 'border-l-blue-500',
  };

  const nextStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';

  const handleCheckboxChange = (e) => {
    e.stopPropagation(); // Prevents the main div's onClick from firing
    onStatusChange(task, nextStatus);
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className={`p-3 mb-2 rounded-lg cursor-pointer border-l-4 transition-all flex items-center gap-4 ${
        isSelected ? 'bg-blue-100' : 'bg-white hover:bg-gray-100'
      } ${priorityColors[task.priority] || 'border-l-gray-400'}`}
    >
      <input
        type="checkbox"
        checked={task.status === 'DONE'}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()} // Extra precaution
        className="form-checkbox h-5 w-5 rounded text-blue-600 transition focus:ring-blue-500"
      />

      <div className="flex-grow">
        <h3 className={`font-semibold ${task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <FaRegCalendarAlt className="mr-1" />
          <span>{task.dueDate || 'No date'}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;