package com.foongdoll.portfolio.planovabe.dto.request;

import java.time.LocalDate;

public record UpdateTaskRequest(
    String title,
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
