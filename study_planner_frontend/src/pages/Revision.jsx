import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { FaBook, FaPlus } from 'react-icons/fa';
import { motion } from "framer-motion";
import RevisionTopicForm from '../components/RevisionTopicForm'; 
import RevisionTopicCard from '../components/RevisionTopicCard';

const Revision = () => {
    const [topics, setTopics] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [view, setView] = useState('welcome');
    const [loading, setLoading] = useState(true);

    const fetchRevisionData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/revision/topics");
            const uniqueSubjects = [...new Set(res.data.map(t => t.subjectName))];
            setTopics(res.data);
            setSubjects(uniqueSubjects);
            if (uniqueSubjects.length > 0 && !selectedSubject) {
                setSelectedSubject(uniqueSubjects[0]);
            }
        } catch (err) {
            console.error("Failed to fetch revision data", err);
        } finally {
            setLoading(false);
        }
    }, [selectedSubject]);

    useEffect(() => {
        fetchRevisionData();
    }, [fetchRevisionData]);

    const filteredTopics = selectedSubject ? topics.filter(t => t.subjectName === selectedSubject) : [];

    const handleUpdate = () => {
        fetchRevisionData();
        setView('welcome');
        setSelectedTopic(null);
    };
    
    /**
     * [THE FIX]
     * This new function handles subject selection. It changes the subject
     * AND closes the side panel by resetting the view.
     */
    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setView('welcome');
        setSelectedTopic(null);
    };
    
    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
            <aside className="w-1/4 max-w-xs bg-white/50 backdrop-blur-sm border-r p-4 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6 flex-shrink-0"><FaBook /> Subjects</h1>
                <div className="space-y-2 overflow-y-auto">
                    {subjects.map(subject => (
                        <button 
                            key={subject} 
                            onClick={() => handleSubjectSelect(subject)} // Use the new handler here
                            className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${selectedSubject === subject ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-blue-100 hover:pl-5'}`}>
                            {subject}
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedSubject || 'Revision Topics'}</h2>
                    <button onClick={() => { setView('form'); setSelectedTopic(null); }}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition transform hover:scale-105">
                        <FaPlus size={12}/> Add Topic
                    </button>
                </div>
                {loading ? <p>Loading topics...</p> : 
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.length > 0 ? filteredTopics.map(topic => (
                        <RevisionTopicCard key={topic.id} topic={topic} onSelect={() => { setView('form'); setSelectedTopic(topic); }}/>
                    )) : <p className="text-gray-500 col-span-full">No topics in this subject. Add one!</p>}
                </motion.div>
                }
            </main>

            <aside className={`transition-all duration-500 ease-in-out bg-white/60 backdrop-blur-sm border-l overflow-hidden ${view === 'welcome' ? 'w-0 p-0' : 'w-1/3 max-w-md'}`}>
                {view !== 'welcome' && <RevisionTopicForm key={selectedTopic ? selectedTopic.id : 'new'} topic={selectedTopic} subjects={subjects} onUpdate={handleUpdate} />}
            </aside>
        </div>
    );
};

export default Revision;