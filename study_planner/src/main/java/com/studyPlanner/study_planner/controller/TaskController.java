package com.studyPlanner.study_planner.controller;


import com.studyPlanner.study_planner.model.Task;
import com.studyPlanner.study_planner.model.User;
import com.studyPlanner.study_planner.repository.TaskRepository;
import com.studyPlanner.study_planner.repository.UserRepository;
import com.studyPlanner.study_planner.dto.TaskRequest;
import com.studyPlanner.study_planner.dto.StatusRequest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

    // No changes needed here
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest req, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        task.setUser(user);
        taskRepo.save(task);
        return ResponseEntity.ok("Task created");
    }

    // No changes needed here
    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(taskRepo.findByUser(user)); // Using findByUser is cleaner
    }

    /**
     * [SECURITY FIX & LOGIC UPDATE]
     * Added check to ensure user owns the task before updating.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequest req, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        taskRepo.save(task);
        return ResponseEntity.ok("Task updated");
    }

    /**
     * [LOGIC UPDATE]
     * When marking a task as DONE, set the completedAt timestamp.
     * Also added security check.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusRequest req, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        task.setStatus(req.getStatus());
        if ("DONE".equalsIgnoreCase(req.getStatus())) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null); // Reset if status changes from DONE
        }

        taskRepo.save(task);
        return ResponseEntity.ok("Status updated");
    }
    
    // Note: I've removed the specific `/done` endpoint as the generic `/status` endpoint handles it better.

    /**
     * [SECURITY FIX]
     * Added check to ensure user owns the task before deleting.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        Task task = taskRepo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        taskRepo.deleteById(id);
        return ResponseEntity.ok("Task deleted");
    }
}