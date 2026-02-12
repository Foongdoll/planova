package com.foongdoll.portfolio.planovabe.repository;

import com.foongdoll.portfolio.planovabe.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
