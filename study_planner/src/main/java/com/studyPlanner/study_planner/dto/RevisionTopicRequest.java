package com.studyPlanner.study_planner.dto;

public class RevisionTopicRequest {
    private String topicName;
    private String subjectName;
    private String difficulty; // e.g., "EASY", "MEDIUM", "HARD"
    private String notes;
    
    // Getters and Setters for all fields...
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}