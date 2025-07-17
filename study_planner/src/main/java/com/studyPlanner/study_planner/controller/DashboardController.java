package com.studyPlanner.study_planner.controller;

import com.studyPlanner.study_planner.dto.DashboardStatsDTO;
import com.studyPlanner.study_planner.model.Task;
import com.studyPlanner.study_planner.model.User;
import com.studyPlanner.study_planner.repository.TaskRepository;
import com.studyPlanner.study_planner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        List<Task> tasks = taskRepository.findByUser(user);

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "DONE".equalsIgnoreCase(t.getStatus())).count();
        long pendingTasks = totalTasks - completedTasks;
        long overdueTasks = tasks.stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()) && t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now()))
                .count();

        double overallCompletionPercentage = (totalTasks == 0) ? 0 : ((double) completedTasks / totalTasks) * 100;

        Map<String, Long> tasksByPriority = tasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority, Collectors.counting()));

        // Completion trend for the last 7 days
        LocalDate today = LocalDate.now();
        Map<LocalDate, Long> completionTrend = tasks.stream()
                .filter(t -> "DONE".equalsIgnoreCase(t.getStatus()) && t.getCompletedAt() != null)
                .filter(t -> !t.getCompletedAt().toLocalDate().isBefore(today.minusDays(6)))
                .collect(Collectors.groupingBy(t -> t.getCompletedAt().toLocalDate(), Collectors.counting()));
        
        // Ensure all last 7 days are present in the map, even with 0 completions
        LongStream.range(0, 7).mapToObj(today::minusDays).forEach(date -> completionTrend.putIfAbsent(date, 0L));


        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalTasks(totalTasks);
        stats.setCompletedTasks(completedTasks);
        stats.setPendingTasks(pendingTasks);
        stats.setOverdueTasks(overdueTasks);
        stats.setOverallCompletionPercentage(overallCompletionPercentage);
        stats.setTasksByPriority(tasksByPriority);
        stats.setCompletionTrend(completionTrend);

        return ResponseEntity.ok(stats);
    }
}