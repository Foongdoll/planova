package com.foongdoll.portfolio.planovabe.repository;

import com.foongdoll.portfolio.planovabe.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdOrderBySortOrder(Long projectId);
    List<Task> findByProjectId(Long projectId);
}
