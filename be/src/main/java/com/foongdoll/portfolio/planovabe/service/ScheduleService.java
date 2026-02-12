package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.response.TaskResponse;
import com.foongdoll.portfolio.planovabe.entity.Dependency;
import com.foongdoll.portfolio.planovabe.entity.Task;
import com.foongdoll.portfolio.planovabe.exception.CycleDetectedException;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.DependencyRepository;
import com.foongdoll.portfolio.planovabe.repository.ProjectRepository;
import com.foongdoll.portfolio.planovabe.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class ScheduleService {

    private final TaskRepository taskRepository;
    private final DependencyRepository dependencyRepository;
    private final ProjectRepository projectRepository;

    public ScheduleService(TaskRepository taskRepository, DependencyRepository dependencyRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.dependencyRepository = dependencyRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public List<TaskResponse> recalculate(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found: " + projectId);
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<Dependency> deps = dependencyRepository.findByProjectId(projectId);

        // Build adjacency and in-degree maps
        Map<Long, List<Long>> successors = new HashMap<>(); // fromTask -> [toTask]
        Map<Long, List<Long>> predecessors = new HashMap<>(); // toTask -> [fromTask]
        Map<Long, Integer> inDegree = new HashMap<>();
        Map<Long, Task> taskMap = new HashMap<>();

        for (Task t : tasks) {
            taskMap.put(t.getId(), t);
            inDegree.put(t.getId(), 0);
            successors.put(t.getId(), new ArrayList<>());
            predecessors.put(t.getId(), new ArrayList<>());
        }

        for (Dependency dep : deps) {
            Long from = dep.getFromTask().getId();
            Long to = dep.getToTask().getId();
            successors.get(from).add(to);
            predecessors.get(to).add(from);
            inDegree.merge(to, 1, Integer::sum);
        }

        // Kahn's algorithm - topological sort
        Queue<Long> queue = new LinkedList<>();
        for (Map.Entry<Long, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) {
                queue.add(entry.getKey());
            }
        }

        int processed = 0;
        while (!queue.isEmpty()) {
            Long taskId = queue.poll();
            processed++;
            Task task = taskMap.get(taskId);

            // Calculate startDate from predecessors
            List<Long> preds = predecessors.get(taskId);
            if (preds != null && !preds.isEmpty()) {
                LocalDate maxEndDate = null;
                for (Long predId : preds) {
                    Task pred = taskMap.get(predId);
                    if (pred.getEndDate() != null) {
                        LocalDate nextDay = pred.getEndDate().plusDays(1);
                        if (maxEndDate == null || nextDay.isAfter(maxEndDate)) {
                            maxEndDate = nextDay;
                        }
                    }
                }
                if (maxEndDate != null) {
                    task.setStartDate(maxEndDate);
                }
            }

            // Calculate endDate
            if (task.getStartDate() != null && task.getDurationDays() != null) {
                task.setEndDate(task.getStartDate().plusDays(task.getDurationDays() - 1));
            }

            taskRepository.save(task);

            // Decrease in-degree of successors
            for (Long succId : successors.get(taskId)) {
                int newDegree = inDegree.get(succId) - 1;
                inDegree.put(succId, newDegree);
                if (newDegree == 0) {
                    queue.add(succId);
                }
            }
        }

        if (processed != tasks.size()) {
            throw new CycleDetectedException("Cycle detected in project dependencies");
        }

        return taskRepository.findByProjectIdOrderBySortOrder(projectId).stream()
                .map(TaskResponse::from)
                .toList();
    }
}
