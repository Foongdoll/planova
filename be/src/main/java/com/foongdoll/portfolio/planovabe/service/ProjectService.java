package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.request.CreateProjectRequest;
import com.foongdoll.portfolio.planovabe.dto.request.UpdateProjectRequest;
import com.foongdoll.portfolio.planovabe.dto.response.ProjectResponse;
import com.foongdoll.portfolio.planovabe.entity.Project;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponse::from)
                .toList();
    }

    public ProjectResponse getProject(Long id) {
        return ProjectResponse.from(findProject(id));
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        Project project = Project.builder()
                .name(request.name())
                .description(request.description())
                .build();
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request) {
        Project project = findProject(id);
        if (request.name() != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = findProject(id);
        projectRepository.delete(project);
    }

    private Project findProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
