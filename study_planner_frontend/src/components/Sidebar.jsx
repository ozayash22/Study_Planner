import { NavLink } from "react-router-dom";
import { FaTasks, FaHome, FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";


const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white border-r border-gray-200 shadow-md h-full p-6 fixed"
    >
      <div className="text-2xl font-bold text-blue-600 mb-8">StudyPlanner</div>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition ${
              isActive ? "bg-blue-100 font-semibold" : ""
            }`
          }
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition ${
              isActive ? "bg-blue-100 font-semibold" : ""
            }`
          }
        >
          <FaTasks /> Tasks
        </NavLink>

        <NavLink
          to="/revision"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition ${
              isActive ? "bg-blue-100 font-semibold" : ""
            }`
          }
        >
          <FaBook /> Revisions
        </NavLink>
      </nav>
      <button
        onClick={logout}
        className="mt-10 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </motion.div>
  );
};

export default Sidebar;
