import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Add this

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ Use login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const token = response.data.token;

      // Save token globally using AuthContext
      login(token); // ✅ Set token globally

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"));
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?technology,workspace')",
      }}
    >
      <div className="bg-white/50 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/30">
        <div className="text-3xl font-semibold text-gray-800 mb-1">
          Sign in with email
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Make a new doc to bring your words, data, and teams together. For
          free
        </p>

        {message && (
          <p
            className={`mb-4 ${
              message.includes("failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="text-right text-sm text-blue-500 hover:underline cursor-pointer">
            Forgot password?
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Get Started
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">Or sign in with</div>
        <div className="flex justify-center gap-4 mt-4">
          <button className="bg-white shadow-md p-3 rounded-full hover:scale-105 transition">
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google"
              className="w-6 h-6"
            />
          </button>
          <button className="bg-white shadow-md p-3 rounded-full hover:scale-105 transition">
            <img
              src="https://img.icons8.com/color/48/facebook-new.png"
              alt="facebook"
              className="w-6 h-6"
            />
          </button>
          <button className="bg-white shadow-md p-3 rounded-full hover:scale-105 transition">
            <img
              src="https://img.icons8.com/ios-filled/50/mac-os.png"
              alt="apple"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* New user link */}
        <div className="mt-6 text-sm text-gray-700">
          New user?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
