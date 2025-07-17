import React, { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../api/axiosInstance";
import TaskListItem from "../components/TaskListItem";
import TaskForm from "../components/TaskForm";
import { FaPlus, FaTasks, FaCalendarDay, FaCalendarAlt, FaCheckSquare, FaExclamationCircle } from "react-icons/fa";
import { isToday, isFuture, parseISO } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("welcome");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = useCallback(async (taskToUpdate, newStatus) => {
    // Optimistically update UI for a faster feel.
    // Using the functional form of setTasks ensures we have the latest state.
    setTasks(currentTasks =>
      currentTasks.map(t =>
        t.id === taskToUpdate.id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await axiosInstance.put(`/tasks/${taskToUpdate.id}/status`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Could not update task status. Syncing with server...");
    } finally {
      // Always fetch fresh data to ensure UI is in sync with the server,
      // both on success and on failure (to correct the optimistic update).
      await fetchTasks();
    }
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let items = tasks;

    switch (activeFilter) {
      case 'TODAY':
        items = items.filter(t => t.dueDate && isToday(parseISO(t.dueDate)));
        break;
      case 'UPCOMING':
        items = items.filter(t => t.dueDate && isFuture(parseISO(t.dueDate)));
        break;
      case 'COMPLETED':
        items = items.filter(t => t.status === 'DONE');
        break;
      case 'PRIORITY':
        items = items.filter(t => t.priority === 'HIGH' && t.status !== 'DONE');
        break;
      default:
        break;
    }

    return items.sort((a, b) => {
      if (a.status === 'DONE' && b.status !== 'DONE') return 1;
      if (a.status !== 'DONE' && b.status === 'DONE') return -1;
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });
  }, [tasks, activeFilter]);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setView("view");
  };

  const handleAddNew = () => {
    setSelectedTask(null);
    setView("form");
    setActiveFilter("ALL");
  };

  const handleTaskUpdate = () => {
    fetchTasks();
    setView("welcome");
    setSelectedTask(null);
  };

  const FilterButton = ({ filterType, icon, label }) => (
    <button
      onClick={() => setActiveFilter(filterType)}
      className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition ${
        activeFilter === filterType ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      {icon} {label}
    </button>
  );

  const WelcomePanel = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <h2 className="text-2xl font-semibold">Welcome to your Task Manager</h2>
        <p className="mt-2">Select a task on the left or add a new one.</p>
    </div>
  );
  
  const NoTasksPanel = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <p className="mt-2">No tasks match the current filter.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Left Panel */}
      <div className="w-1/3 max-w-sm border-r bg-white overflow-y-auto flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h1 className="text-xl font-bold">Menu</h1>
          <button onClick={handleAddNew} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition" aria-label="Add New Task">
            <FaPlus />
          </button>
        </div>

        <div className="p-4 space-y-2 border-b">
          <FilterButton filterType="ALL" icon={<FaTasks />} label="All Tasks" />
          <FilterButton filterType="TODAY" icon={<FaCalendarDay />} label="Today" />
          <FilterButton filterType="UPCOMING" icon={<FaCalendarAlt />} label="Upcoming" />
          <FilterButton filterType="PRIORITY" icon={<FaExclamationCircle />} label="High Priority" />
          <FilterButton filterType="COMPLETED" icon={<FaCheckSquare />} label="Completed" />
        </div>

        <div className="p-2 flex-grow">
          {loading ? (
            <p className="p-4 text-gray-500 text-center">Loading...</p>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                isSelected={selectedTask?.id === task.id}
                onSelect={handleSelectTask}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <NoTasksPanel />
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6 md:p-8">
        {view === 'welcome' && <WelcomePanel />}
        {(view === 'view' || view === 'form') && (
            <TaskForm
                task={selectedTask}
                onTaskUpdate={handleTaskUpdate}
                key={selectedTask ? selectedTask.id : 'new-task'}
            />
        )}
      </div>
    </div>
  );
};

export default Tasks;