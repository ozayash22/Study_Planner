package com.studyPlanner.study_planner.dto;

public class TopicRequest {

    private String name;
    private Long subjectId;

    public TopicRequest() {}

    public TopicRequest(String name, Long subjectId) {
        this.name = name;
        this.subjectId = subjectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}
