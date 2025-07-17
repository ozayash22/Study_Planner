package com.studyPlanner.study_planner.repository;


import com.studyPlanner.study_planner.model.Task;
import com.studyPlanner.study_planner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUser(User user);
}

