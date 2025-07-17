import React from 'react';
import { motion } from 'framer-motion';
import { FaRegCalendarAlt, FaFire, FaLeaf, FaSnowflake } from 'react-icons/fa';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const difficultyMap = {
    HARD: { icon: <FaFire className="text-red-500"/>, label: 'Hard', color: 'bg-red-100' },
    MEDIUM: { icon: <FaLeaf className="text-orange-500"/>, label: 'Medium', color: 'bg-orange-100' },
    EASY: { icon: <FaSnowflake className="text-blue-500"/>, label: 'Easy', color: 'bg-blue-100' }
};

const RevisionTopicCard = ({ topic, onSelect }) => {
    const difficultyInfo = difficultyMap[topic.difficulty] || difficultyMap.MEDIUM;
    return (
        <motion.div layout variants={cardVariants} initial="hidden" animate="visible" exit="hidden"
            onClick={onSelect}
            className="p-5 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all">
            <h3 className="text-lg font-bold text-gray-800">{topic.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{topic.subjectName}</p>
            <div className="flex justify-between items-center text-xs">
                <span className={`flex items-center gap-2 px-2 py-1 rounded-full ${difficultyInfo.color}`}>
                    {difficultyInfo.icon} {difficultyInfo.label}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                    <FaRegCalendarAlt/> Next: {topic.nextRevisionDate}
                </span>
            </div>
        </motion.div>
    );
};
export default RevisionTopicCard;