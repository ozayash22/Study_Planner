package com.studyPlanner.study_planner.dto;

import java.time.LocalDate;
import java.util.Map;

public class DashboardStatsDTO {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long overdueTasks;
    private double overallCompletionPercentage;
    private Map<String, Long> tasksByPriority;
    private Map<LocalDate, Long> completionTrend; // Trend for the last 7 days

    // Getters and Setters...
    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }
    public long getOverdueTasks() { return overdueTasks; }
    public void setOverdueTasks(long overdueTasks) { this.overdueTasks = overdueTasks; }
    public double getOverallCompletionPercentage() { return overallCompletionPercentage; }
    public void setOverallCompletionPercentage(double overallCompletionPercentage) { this.overallCompletionPercentage = overallCompletionPercentage; }
    public Map<String, Long> getTasksByPriority() { return tasksByPriority; }
    public void setTasksByPriority(Map<String, Long> tasksByPriority) { this.tasksByPriority = tasksByPriority; }
    public Map<LocalDate, Long> getCompletionTrend() { return completionTrend; }
    public void setCompletionTrend(Map<LocalDate, Long> completionTrend) { this.completionTrend = completionTrend; }
}