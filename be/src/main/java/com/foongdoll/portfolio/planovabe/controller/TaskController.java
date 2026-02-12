package com.foongdoll.portfolio.planovabe.controller;

import com.foongdoll.portfolio.planovabe.dto.request.CreateTaskRequest;
import com.foongdoll.portfolio.planovabe.dto.request.UpdateTaskRequest;
import com.foongdoll.portfolio.planovabe.dto.response.TaskResponse;
import com.foongdoll.portfolio.planovabe.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> create(@PathVariable Long projectId, @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(projectId, request));
    }

    @PatchMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long taskId, @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<Void> delete(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
