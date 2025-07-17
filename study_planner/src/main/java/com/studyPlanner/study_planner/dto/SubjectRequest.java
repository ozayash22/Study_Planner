package com.studyPlanner.study_planner.dto;

public class SubjectRequest {

    private String name;

    public SubjectRequest() {}

    public SubjectRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
