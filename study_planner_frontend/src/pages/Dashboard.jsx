import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { FaBookReader, FaChevronDown, FaChevronUp, FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { AnimatePresence, motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todaysRevisions, setTodaysRevisions] = useState([]);
  const [isRevisionPanelOpen, setIsRevisionPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsPromise = axiosInstance.get("/dashboard/stats");
        const revisionPromise = axiosInstance.get("/revision/today");

        const [statsRes, revisionRes] = await Promise.all([statsPromise, revisionPromise]);
        
        setStats(statsRes.data);
        setTodaysRevisions(revisionRes.data);

      } catch (err) {
        console.error("Failed to load dashboard data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  if (loading) return <div className="text-center p-10">Loading Dashboard...</div>;
  if (!stats) return <div className="text-center p-10 text-red-500">Could not load dashboard data.</div>;

  const priorityData = {
    labels: Object.keys(stats.tasksByPriority),
    datasets: [{
      data: Object.values(stats.tasksByPriority),
      backgroundColor: ['#EF4444', '#F97316', '#3B82F6'],
    }],
  };
  
  const completionTrendLabels = Object.keys(stats.completionTrend)
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a - b)
    .map(date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  
  const completionTrendData = {
    labels: completionTrendLabels,
    datasets: [{
      label: 'Tasks Completed',
      data: Object.entries(stats.completionTrend)
            .sort((a,b) => new Date(a[0]) - new Date(b[0]))
            .map(entry => entry[1]),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, {user?.name || 'User'}!</h1>
        <p className="text-gray-500 mb-8">Here's a snapshot of your productivity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaCheckCircle />} title="Completed Tasks" value={stats.completedTasks} color="text-green-500" />
          <StatCard icon={<FaClock />} title="Pending Tasks" value={stats.pendingTasks} color="text-blue-500" />
          <StatCard icon={<FaExclamationTriangle />} title="Overdue Tasks" value={stats.overdueTasks} color="text-red-500" />
          <StatCard icon={<FaTasks />} title="Overall Completion" value={`${stats.overallCompletionPercentage.toFixed(1)}%`} color="text-purple-500" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <button
            onClick={() => setIsRevisionPanelOpen(!isRevisionPanelOpen)}
            className="w-full flex justify-between items-center text-xl font-semibold text-gray-700"
          >
            <div className="flex items-center gap-3">
              <FaBookReader className="text-indigo-500" />
              <span>Today's Revision Topics ({todaysRevisions.length})</span>
            </div>
            {isRevisionPanelOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <AnimatePresence>
            {isRevisionPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t space-y-3">
                  {todaysRevisions.length > 0 ? (
                    todaysRevisions.map(topic => (
                      <div key={topic.id} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition">
                        <p className="font-semibold">{topic.name}</p>
                        <p className="text-sm text-gray-500">{topic.subjectName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No topics to revise today. Great job!</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Tasks by Priority</h2>
            {stats.totalTasks > 0 ? <Doughnut data={priorityData} /> : <p className="text-center text-gray-500 mt-10">No tasks to display.</p>}
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Daily Performance</h2>
            {stats.totalTasks > 0 ? <Bar data={completionTrendData} /> : <p className="text-center text-gray-500 mt-10">Complete some tasks to see your trend!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;