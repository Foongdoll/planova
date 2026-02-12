package com.foongdoll.portfolio.planovabe.controller;

import com.foongdoll.portfolio.planovabe.dto.request.CreateDependencyRequest;
import com.foongdoll.portfolio.planovabe.dto.response.DependencyResponse;
import com.foongdoll.portfolio.planovabe.service.DependencyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DependencyController {

    private final DependencyService dependencyService;

    public DependencyController(DependencyService dependencyService) {
        this.dependencyService = dependencyService;
    }

    @GetMapping("/api/projects/{projectId}/dependencies")
    public ResponseEntity<List<DependencyResponse>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(dependencyService.getDependenciesByProject(projectId));
    }

    @PostMapping("/api/projects/{projectId}/dependencies")
    public ResponseEntity<DependencyResponse> create(@PathVariable Long projectId,
                                                      @Valid @RequestBody CreateDependencyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dependencyService.createDependency(projectId, request));
    }

    @DeleteMapping("/api/dependencies/{depId}")
    public ResponseEntity<Void> delete(@PathVariable Long depId) {
        dependencyService.deleteDependency(depId);
        return ResponseEntity.noContent().build();
    }
}
