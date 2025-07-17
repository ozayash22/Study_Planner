package com.studyPlanner.study_planner.controller;

import com.studyPlanner.study_planner.dto.RevisionTopicRequest;
import com.studyPlanner.study_planner.dto.SubjectRequest;
import com.studyPlanner.study_planner.dto.TopicResponse;
import com.studyPlanner.study_planner.model.Difficulty;
import com.studyPlanner.study_planner.model.Subject;
import com.studyPlanner.study_planner.model.Topic;
import com.studyPlanner.study_planner.model.Topic.Status;
import com.studyPlanner.study_planner.model.User;
import com.studyPlanner.study_planner.repository.SubjectRepository;
import com.studyPlanner.study_planner.repository.TopicRepository;
import com.studyPlanner.study_planner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/revision")
@CrossOrigin(origins = "http://localhost:3000")
public class RevisionController {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    /** [FROM PREVIOUS VERSION] Endpoint to add a subject directly. */
    @PostMapping("/subject")
    public ResponseEntity<?> addSubject(@RequestBody SubjectRequest request, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        if (!subjectRepository.existsByNameAndUser(request.getName(), user)) {
            Subject subject = new Subject();
            subject.setName(request.getName());
            subject.setUser(user);
            subjectRepository.save(subject);
            return ResponseEntity.ok("Subject added.");
        }
        return ResponseEntity.badRequest().body("Subject already exists.");
    }

    /** [ENHANCED] Now handles difficulty, notes, and spaced repetition. */
    @PostMapping("/topic")
    public ResponseEntity<?> addTopicBySubjectName(@RequestBody RevisionTopicRequest req, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        
        Subject subject = subjectRepository.findByNameAndUser(req.getSubjectName(), user)
                .orElseGet(() -> {
                    Subject newSubject = new Subject();
                    newSubject.setName(req.getSubjectName());
                    newSubject.setUser(user);
                    return subjectRepository.save(newSubject);
                });

        Topic topic = new Topic();
        topic.setName(req.getTopicName());
        topic.setSubject(subject);
        topic.setNotes(req.getNotes());
        topic.setStatus(Status.UPCOMING);

        Difficulty difficulty = Difficulty.valueOf(req.getDifficulty().toUpperCase());
        topic.setDifficulty(difficulty);

        int daysToAdd;
        switch (difficulty) {
            case EASY: daysToAdd = 20; break;
            case HARD: daysToAdd = 10; break;
            default: daysToAdd = 15; break;
        }
        topic.setNextRevisionDate(LocalDate.now().plusDays(daysToAdd));

        topicRepository.save(topic);
        return ResponseEntity.ok("Topic saved with subject");
    }

    /** [ENHANCED] Now includes difficulty and notes in the response. */
    @GetMapping("/topics")
    public ResponseEntity<List<TopicResponse>> getTopics(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Topic> topics = topicRepository.findBySubject_User(user);
        return ResponseEntity.ok(mapTopicsToResponse(topics));
    }

    /** [NEW] For the dashboard panel to get only today's topics. */
    @GetMapping("/today")
    public ResponseEntity<List<TopicResponse>> getTodaysTopics(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Topic> topics = topicRepository.findBySubject_UserAndNextRevisionDate(user, LocalDate.now());
        return ResponseEntity.ok(mapTopicsToResponse(topics));
    }

    /** [FROM PREVIOUS VERSION] Endpoint to get all subject names. */
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getSubjects(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(subjectRepository.findByUser(user).stream()
                .map(Subject::getName)
                .collect(Collectors.toList()));
    }

    /** [FROM PREVIOUS VERSION & ENHANCED] Gets topics in a date range. */
    @GetMapping("/upcoming")
    public ResponseEntity<List<TopicResponse>> getUpcomingByDate(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Topic> topics = topicRepository.findBySubject_UserAndNextRevisionDateBetween(user, start, end);
        return ResponseEntity.ok(mapTopicsToResponse(topics));
    }

    /** [FROM PREVIOUS VERSION & ENHANCED] Gets topics for a specific subject. */
    @GetMapping("/filter")
    public ResponseEntity<List<TopicResponse>> getBySubject(
            Principal principal,
            @RequestParam String subjectName) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Subject subject = subjectRepository.findByNameAndUser(subjectName, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        List<Topic> topics = topicRepository.findBySubjectAndSubject_User(subject, user);
        return ResponseEntity.ok(mapTopicsToResponse(topics));
    }

    @PutMapping("/topic/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable Long id, @RequestBody RevisionTopicRequest req, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        // Security check: ensure the topic belongs to the logged-in user
        if (!topic.getSubject().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Find or create the new subject if the name has changed
        Subject subject = subjectRepository.findByNameAndUser(req.getSubjectName(), user)
                .orElseGet(() -> {
                    Subject newSubject = new Subject();
                    newSubject.setName(req.getSubjectName());
                    newSubject.setUser(user);
                    return subjectRepository.save(newSubject);
                });
        
        // Update topic fields
        topic.setName(req.getTopicName());
        topic.setSubject(subject);
        topic.setNotes(req.getNotes());
        
        Difficulty difficulty = Difficulty.valueOf(req.getDifficulty().toUpperCase());
        topic.setDifficulty(difficulty);

        topicRepository.save(topic);
        return ResponseEntity.ok("Topic updated successfully");
    }

    @DeleteMapping("/topic/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));

        if (!topic.getSubject().getUser().getId().equals(user.getId())) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        
        topicRepository.deleteById(id);
        return ResponseEntity.ok("Topic deleted.");
    }
    
    // Helper method to avoid code repetition
    private List<TopicResponse> mapTopicsToResponse(List<Topic> topics) {
        return topics.stream().map(t -> new TopicResponse(
                t.getId(),
                t.getName(),
                t.getSubject().getName(),
                t.getNextRevisionDate(),
                t.getStatus().name(),
                t.getDifficulty() != null ? t.getDifficulty().name() : "MEDIUM", // Default for older data
                t.getNotes()))
                .collect(Collectors.toList());
    }
}