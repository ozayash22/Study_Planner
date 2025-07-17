import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Revision from './pages/Revision';
import MainLayout from './components/MainLayout';

const AppWrapper = () => (
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
);

const App = () => {
  return (
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/revision" element={<Revision />} />
        </Route>

        {/* --- Default Route --- */}
        {/* If you go to the root, it redirects to the dashboard */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
  );
}

export default AppWrapper;