import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaTasks, FaBookOpen } from 'react-icons/fa';

const FeatureCard = ({ icon, title, text }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-blue-500 text-4xl mb-4 inline-block">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{text}</p>
    </div>
);

const LandingPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">StudyPlanner</div>
                    <div className="space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main>
                <section className="text-center py-20 lg:py-32 px-6 bg-gradient-to-b from-white to-blue-50">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl lg:text-6xl font-extrabold text-gray-900"
                    >
                        Organize Your Success, One Task at a Time.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        StudyPlanner helps you manage tasks, schedule revisions, and track your progress, all in one place.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }} 
                        className="mt-8"
                    >
                        <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                            Get Started for Free
                        </Link>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-6">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Everything You Need to Succeed</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard icon={<FaTasks />} title="Smart Task Management" text="Organize your to-do lists with priorities and due dates to stay on track." />
                            <FeatureCard icon={<FaBookOpen />} title="Spaced Repetition" text="Schedule revision topics based on difficulty to maximize memory retention." />
                            <FeatureCard icon={<FaChalkboardTeacher />} title="Progress Dashboard" text="Visualize your productivity with insightful charts and statistics." />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;