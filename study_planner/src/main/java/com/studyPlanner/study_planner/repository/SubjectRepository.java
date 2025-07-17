package com.studyPlanner.study_planner.repository;

import com.studyPlanner.study_planner.model.Subject;
import com.studyPlanner.study_planner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByUser(User user);

    boolean existsByNameAndUser(String name, User user);

    Optional<Subject> findByNameAndUser(String name, User user);
}
