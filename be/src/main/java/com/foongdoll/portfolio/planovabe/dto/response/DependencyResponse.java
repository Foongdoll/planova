package com.foongdoll.portfolio.planovabe.dto.response;

import com.foongdoll.portfolio.planovabe.entity.Dependency;
import java.time.LocalDateTime;

public record DependencyResponse(
    Long id,
    Long projectId,
    Long fromTaskId,
    Long toTaskId,
    LocalDateTime createdAt
) {
    public static DependencyResponse from(Dependency dep) {
        return new DependencyResponse(
            dep.getId(),
            dep.getProject().getId(),
            dep.getFromTask().getId(),
            dep.getToTask().getId(),
            dep.getCreatedAt()
        );
    }
}
