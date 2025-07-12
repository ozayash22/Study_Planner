import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
      
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </Link>
    </div>
  );
};

export default Dashboard;
