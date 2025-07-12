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

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

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

    @GetMapping
    public ResponseEntity<List<Task>> getTasks(Principal principal) {
        User user = userRepo.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(taskRepo.findByUserId(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody TaskRequest req) {
        Task task = taskRepo.findById(id).orElseThrow();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setPriority(req.getPriority());
        task.setDueDate(req.getDueDate());
        taskRepo.save(task);
        return ResponseEntity.ok("Task updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskRepo.deleteById(id);
        return ResponseEntity.ok("Task deleted");
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<?> markAsDone(@PathVariable Long id) {
        Task task = taskRepo.findById(id).orElseThrow();
        task.setStatus("DONE");
        taskRepo.save(task);
        return ResponseEntity.ok("Task marked as done");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusRequest req) {
        Task task = taskRepo.findById(id).orElseThrow();
        task.setStatus(req.getStatus());
        taskRepo.save(task);
        return ResponseEntity.ok("Status updated");
    }
}
