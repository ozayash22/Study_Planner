import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const RevisionTopicForm = ({ topic: initialTopic, subjects, onUpdate }) => {
    const [formData, setFormData] = useState({});
    const [newSubject, setNewSubject] = useState('');
    const [isEditing, setIsEditing] = useState(!initialTopic);

    useEffect(() => {
        if (initialTopic) {
            setFormData({
                topicName: initialTopic.name || '',
                subjectName: initialTopic.subjectName || '',
                difficulty: initialTopic.difficulty || 'MEDIUM',
                notes: initialTopic.notes || ''
            });
            setIsEditing(false);
            setNewSubject('');
        } else {
            setFormData({
                topicName: '',
                subjectName: subjects[0] || '',
                difficulty: 'MEDIUM',
                notes: ''
            });
            setIsEditing(true);
            setNewSubject('');
        }
    }, [initialTopic, subjects]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNewSubjectChange = (e) => {
        setNewSubject(e.target.value);
        if (e.target.value) {
            setFormData(prev => ({...prev, subjectName: ''}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalSubjectName = newSubject.trim() || formData.subjectName;
        if (!finalSubjectName) {
            alert("Please select or add a subject.");
            return;
        }

        const payload = { ...formData, subjectName: finalSubjectName };
        const apiCall = initialTopic
            ? axiosInstance.put(`/revision/topic/${initialTopic.id}`, payload)
            : axiosInstance.post('/revision/topic', payload);

        try {
            await apiCall;
            onUpdate();
        } catch (err) {
            console.error("Failed to save topic", err);
            alert("Error: Could not save the topic.");
        }
    };
    
    const handleCancel = () => {
        if (initialTopic) {
            setFormData({
                topicName: initialTopic.name,
                subjectName: initialTopic.subjectName,
                difficulty: initialTopic.difficulty,
                notes: initialTopic.notes || ''
            });
            setNewSubject('');
            setIsEditing(false);
        } else {
            onUpdate();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold">{initialTopic ? 'Topic Details' : 'Add New Topic'}</h2>
                {!isEditing && initialTopic && (
                    <button type="button" onClick={() => setIsEditing(true)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold">Edit</button>
                )}
            </div>
            
            <div className="space-y-4 flex-grow overflow-y-auto pr-2">
                <div>
                    <label className="font-semibold text-gray-700">Topic</label>
                    <input name="topicName" value={formData.topicName} onChange={handleChange} disabled={!isEditing} required className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-700">Existing Subject</label>
                    <select name="subjectName" value={formData.subjectName} onChange={handleChange} disabled={!isEditing || !!newSubject} className="w-full mt-1 p-2 border rounded-lg bg-white disabled:bg-gray-200">
                        <option value="">-- Select a subject --</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2"><hr className="flex-grow"/><span className="text-gray-500 text-sm">OR</span><hr className="flex-grow"/></div>
                <div>
                    <label className="font-semibold text-gray-700">Add New Subject</label>
                    <input name="newSubject" value={newSubject} onChange={handleNewSubjectChange} disabled={!isEditing || !!formData.subjectName} placeholder="e.g., Quantum Physics" className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-700">Difficulty</label>
                    <select name="difficulty" value={formData.difficulty} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 p-2 border rounded-lg bg-white disabled:bg-gray-200">
                        <option value="HARD">Hard (Revise in 10 days)</option>
                        <option value="MEDIUM">Medium (Revise in 15 days)</option>
                        <option value="EASY">Easy (Revise in 20 days)</option>
                    </select>
                </div>
                <div>
                    <label className="font-semibold text-gray-700">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} disabled={!isEditing} rows="5" className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"/>
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 flex justify-end gap-3 flex-shrink-0">
                    <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
                    <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-600">
                        {initialTopic ? 'Update' : 'Save'}
                    </button>
                </div>
            )}
        </form>
    );
};
export default RevisionTopicForm;