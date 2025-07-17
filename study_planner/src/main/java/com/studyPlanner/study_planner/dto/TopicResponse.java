package com.studyPlanner.study_planner.dto;

import java.time.LocalDate;

public class TopicResponse {

    private Long id;
    private String name;
    private String subjectName;
    private LocalDate nextRevisionDate;
    private String status;
    private String difficulty;
    private String notes;

    public TopicResponse() {}

    public TopicResponse(Long id, String name, String subjectName, LocalDate nextRevisionDate, String status, String difficulty, String notes) {
        this.id = id;
        this.name = name;
        this.subjectName = subjectName;
        this.nextRevisionDate = nextRevisionDate;
        this.status = status;
        this.difficulty = difficulty;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public LocalDate getNextRevisionDate() {
        return nextRevisionDate;
    }

    public void setNextRevisionDate(LocalDate nextRevisionDate) {
        this.nextRevisionDate = nextRevisionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
