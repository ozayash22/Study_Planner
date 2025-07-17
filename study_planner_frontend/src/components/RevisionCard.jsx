import React from "react";

const RevisionCard = ({ topic, onDelete }) => {
    return (
        <div className="p-4 border rounded-lg flex justify-between items-center">
            <div>
                <h4 className="font-bold">{topic.name}</h4>
                <p className="text-sm text-gray-500">Subject: {topic.subjectName}</p>
                <p className="text-sm">Next Revision: {topic.nextRevisionDate}</p>
                <p className="text-sm">Status: {topic.status}</p>
            </div>
            <button
                onClick={() => onDelete(topic.id)}
                className="text-red-500 hover:text-red-700"
            >
                Delete
            </button>
        </div>
    );
};

export default RevisionCard;
