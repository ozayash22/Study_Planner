import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { token } = useAuth();

  // If there's no token, redirect to the landing page
  if (!token) {
    return <Navigate to="/landing" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;