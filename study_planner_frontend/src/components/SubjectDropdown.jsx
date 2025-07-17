import React from "react";

const SubjectDropdown = ({ subjects, selected, onChange }) => {
    return (
        <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border rounded"
        >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                    {subject.name}
                </option>
            ))}
        </select>
    );
};

export default SubjectDropdown;
