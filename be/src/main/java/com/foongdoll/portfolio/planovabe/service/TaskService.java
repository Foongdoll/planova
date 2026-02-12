package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.request.CreateTaskRequest;
import com.foongdoll.portfolio.planovabe.dto.request.UpdateTaskRequest;
import com.foongdoll.portfolio.planovabe.dto.response.TaskResponse;
import com.foongdoll.portfolio.planovabe.entity.Project;
import com.foongdoll.portfolio.planovabe.entity.Task;
import com.foongdoll.portfolio.planovabe.entity.TaskStatus;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.ProjectRepository;
import com.foongdoll.portfolio.planovabe.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderBySortOrder(projectId).stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional
    public TaskResponse createTask(Long projectId, CreateTaskRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        Task parent = null;
        if (request.parentId() != null) {
            parent = taskRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent task not found: " + request.parentId()));
        }

        TaskStatus status = TaskStatus.TODO;
        if (request.status() != null) {
            status = TaskStatus.valueOf(request.status());
        }

        Task task = Task.builder()
                .project(project)
                .parent(parent)
                .title(request.title())
                .description(request.description())
                .status(status)
                .startDate(request.startDate())
                .durationDays(request.durationDays())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .positionX(request.positionX())
                .positionY(request.positionY())
                .color(request.color())
                .build();

        // Calculate endDate
        if (task.getStartDate() != null && task.getDurationDays() != null) {
            task.setEndDate(task.getStartDate().plusDays(task.getDurationDays() - 1));
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
        Task task = findTask(taskId);

        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.status() != null) task.setStatus(TaskStatus.valueOf(request.status()));
        if (request.startDate() != null) task.setStartDate(request.startDate());
        if (request.durationDays() != null) task.setDurationDays(request.durationDays());
        if (request.sortOrder() != null) task.setSortOrder(request.sortOrder());
        if (request.positionX() != null) task.setPositionX(request.positionX());
        if (request.positionY() != null) task.setPositionY(request.positionY());
        if (request.color() != null) task.setColor(request.color().isEmpty() ? null : request.color());

        if (request.parentId() != null) {
            Task parent = taskRepository.findById(request.parentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent task not found: " + request.parentId()));
            task.setParent(parent);
        }

        // Recalculate endDate
        if (task.getStartDate() != null && task.getDurationDays() != null) {
            task.setEndDate(task.getStartDate().plusDays(task.getDurationDays() - 1));
        }

        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = findTask(taskId);
        taskRepository.delete(task);
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }
}
