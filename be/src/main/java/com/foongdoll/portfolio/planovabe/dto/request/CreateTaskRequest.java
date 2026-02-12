package com.foongdoll.portfolio.planovabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CreateTaskRequest(
    @NotBlank String title,
    String description,
    Long parentId,
    String status,
    LocalDate startDate,
    Integer durationDays,
    Integer sortOrder,
    Double positionX,
    Double positionY,
    String color
) {}
