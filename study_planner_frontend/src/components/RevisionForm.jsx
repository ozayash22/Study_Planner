import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import SubjectDropdown from "./SubjectDropdown"; // Assuming this component is correct

const RevisionForm = ({ onTopicAdded }) => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [topic, setTopic] = useState("");

    /**
     * [FIXED]
     * Fetches from the new, more efficient `/revision/subjects` endpoint.
     */
    useEffect(() => {
        axiosInstance.get("/revision/subjects").then((res) => {
            // The response is now a simple array of strings, e.g., ["Math", "Science"]
            const subjectObjects = res.data.map((name, index) => ({ id: index + 1, name }));
            setSubjects(subjectObjects);
        }).catch(err => {
            console.error("Failed to fetch subjects:", err);
        });
    }, []);

    const handleAddTopic = async (e) => {
        e.preventDefault();

        if (!topic.trim()) return alert("Please enter a topic name.");
        
        const subjectForPost = newSubject.trim() || selectedSubject;
        if (!subjectForPost) return alert("Please select or enter a subject.");

        try {
            await axiosInstance.post("/revision/topic", {
                topicName: topic.trim(),
                subjectName: subjectForPost,
            });

            // [FIXED] Call the callback to notify the parent component to refresh.
            onTopicAdded();

            // [FIXED] Reset form fields for a better user experience.
            setTopic("");
            setNewSubject("");
            setSelectedSubject("");
            
            // Optionally, refetch subjects in case a new one was added
            // This is a simple way to update the dropdown.
            axiosInstance.get("/revision/subjects").then((res) => {
                const subjectObjects = res.data.map((name, index) => ({ id: index + 1, name }));
                setSubjects(subjectObjects);
            });


        } catch (err) {
            console.error("Error adding topic:", err);
            alert("Failed to add topic. Check console for details.");
        }
    };

    return (
        <form onSubmit={handleAddTopic} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">
            <input
                type="text"
                placeholder="Enter topic name"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="p-2 border rounded"
            />

            <SubjectDropdown
                subjects={subjects}
                selected={selectedSubject}
                onChange={setSelectedSubject}
                disabled={!!newSubject} // Optionally disable dropdown if typing a new subject
            />

            <div className="flex items-center gap-2">
                <hr className="flex-grow"/>
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="flex-grow"/>
            </div>

            <input
                type="text"
                placeholder="Add a new subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="p-2 border rounded"
                disabled={!!selectedSubject} // Optionally disable new subject input if one is selected
            />

            <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Add Topic
            </button>
        </form>
    );
};

export default RevisionForm;