// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 ${isAuthenticated ? "ml-64" : ""} p-6 overflow-y-auto`}>
          <Routes>
            <Route path="/" element={<Dashboard /> } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
