package com.studyPlanner.study_planner.repository;

import com.studyPlanner.study_planner.model.Subject;
import com.studyPlanner.study_planner.model.Topic;
import com.studyPlanner.study_planner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    List<Topic> findBySubject_User(User user);

    List<Topic> findBySubjectAndSubject_User(Subject subject, User user);

    List<Topic> findBySubject_UserAndNextRevisionDateBetween(User user, LocalDate start, LocalDate end);

    List<Topic> findBySubject_UserAndNextRevisionDate(User user, LocalDate date);
}
