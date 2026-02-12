package com.foongdoll.portfolio.planovabe.dto.response;

import com.foongdoll.portfolio.planovabe.entity.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    Long projectId,
    Long parentId,
    String title,
    String description,
    String status,
    LocalDate startDate,
    Integer durationDays,
    LocalDate endDate,
    Integer sortOrder,
    Double positionX,
    Double positionY,
    String color,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getProject().getId(),
            task.getParent() != null ? task.getParent().getId() : null,
            task.getTitle(),
            task.getDescription(),
            task.getStatus().name(),
            task.getStartDate(),
            task.getDurationDays(),
            task.getEndDate(),
            task.getSortOrder(),
            task.getPositionX(),
            task.getPositionY(),
            task.getColor(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
