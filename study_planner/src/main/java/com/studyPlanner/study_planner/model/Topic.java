package com.studyPlanner.study_planner.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    private LocalDate nextRevisionDate;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    /**
     * [THE FIX]
     * This field now matches the 'removed' column in your database.
     * We initialize it to 'false' so that every new Topic object
     * will have a default value for this field, resolving the error.
     */
    @Column(nullable = false)
    private boolean removed = false;

    public enum Status {
        UPCOMING,
        COMPLETED,
        OVERDUE
    }
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    /** [NEW FIELD] User notes for the topic. */
    @Lob // Good for long text content
    @Column(columnDefinition = "TEXT")
    private String notes;

    // --- Getters and Setters ---

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

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public LocalDate getNextRevisionDate() {
        return nextRevisionDate;
    }

    public void setNextRevisionDate(LocalDate nextRevisionDate) {
        this.nextRevisionDate = nextRevisionDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    
}