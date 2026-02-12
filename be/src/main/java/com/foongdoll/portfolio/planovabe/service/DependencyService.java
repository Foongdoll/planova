package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.request.CreateDependencyRequest;
import com.foongdoll.portfolio.planovabe.dto.response.DependencyResponse;
import com.foongdoll.portfolio.planovabe.entity.Dependency;
import com.foongdoll.portfolio.planovabe.entity.Project;
import com.foongdoll.portfolio.planovabe.entity.Task;
import com.foongdoll.portfolio.planovabe.exception.CycleDetectedException;
import com.foongdoll.portfolio.planovabe.exception.DuplicateResourceException;
import com.foongdoll.portfolio.planovabe.exception.InvalidRequestException;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.DependencyRepository;
import com.foongdoll.portfolio.planovabe.repository.ProjectRepository;
import com.foongdoll.portfolio.planovabe.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DependencyService {

    private final DependencyRepository dependencyRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DependencyService(DependencyRepository dependencyRepository,
                             ProjectRepository projectRepository,
                             TaskRepository taskRepository) {
        this.dependencyRepository = dependencyRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    public List<DependencyResponse> getDependenciesByProject(Long projectId) {
        return dependencyRepository.findByProjectId(projectId).stream()
                .map(DependencyResponse::from)
                .toList();
    }

    @Transactional
    public DependencyResponse createDependency(Long projectId, CreateDependencyRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        Task fromTask = taskRepository.findById(request.fromTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("From task not found: " + request.fromTaskId()));

        Task toTask = taskRepository.findById(request.toTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("To task not found: " + request.toTaskId()));

        if (fromTask.getId().equals(toTask.getId())) {
            throw new InvalidRequestException("Cannot create self-dependency");
        }

        if (dependencyRepository.existsByFromTaskIdAndToTaskId(request.fromTaskId(), request.toTaskId())) {
            throw new DuplicateResourceException("Dependency already exists");
        }

        // Cycle detection: check if toTask can reach fromTask through existing dependencies
        if (wouldCreateCycle(projectId, request.toTaskId(), request.fromTaskId())) {
            throw new CycleDetectedException("Adding this dependency would create a cycle");
        }

        Dependency dependency = Dependency.builder()
                .project(project)
                .fromTask(fromTask)
                .toTask(toTask)
                .build();

        return DependencyResponse.from(dependencyRepository.save(dependency));
    }

    @Transactional
    public void deleteDependency(Long depId) {
        Dependency dep = dependencyRepository.findById(depId)
                .orElseThrow(() -> new ResourceNotFoundException("Dependency not found: " + depId));
        dependencyRepository.delete(dep);
    }

    private boolean wouldCreateCycle(Long projectId, Long startTaskId, Long targetTaskId) {
        // BFS from startTaskId following existing edges (fromTask -> toTask)
        // If we can reach targetTaskId, adding the reverse edge would create a cycle
        List<Dependency> allDeps = dependencyRepository.findByProjectId(projectId);

        Map<Long, List<Long>> adjacency = new HashMap<>();
        for (Dependency dep : allDeps) {
            adjacency.computeIfAbsent(dep.getFromTask().getId(), k -> new ArrayList<>())
                    .add(dep.getToTask().getId());
        }

        Set<Long> visited = new HashSet<>();
        Queue<Long> queue = new LinkedList<>();
        queue.add(startTaskId);
        visited.add(startTaskId);

        while (!queue.isEmpty()) {
            Long current = queue.poll();
            if (current.equals(targetTaskId)) {
                return true;
            }
            List<Long> neighbors = adjacency.getOrDefault(current, Collections.emptyList());
            for (Long neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }

        return false;
    }
}
