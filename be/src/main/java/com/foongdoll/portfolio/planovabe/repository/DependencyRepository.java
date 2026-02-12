package com.foongdoll.portfolio.planovabe.repository;

import com.foongdoll.portfolio.planovabe.entity.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DependencyRepository extends JpaRepository<Dependency, Long> {
    List<Dependency> findByProjectId(Long projectId);
    boolean existsByFromTaskIdAndToTaskId(Long fromTaskId, Long toTaskId);
}
