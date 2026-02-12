package com.foongdoll.portfolio.planovabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record CreateCalendarEventRequest(
    @NotBlank String title,
    String description,
    @NotNull LocalDate startDate,
    LocalTime startTime,
    @NotNull LocalDate endDate,
    LocalTime endTime,
    Boolean allDay,
    String color
) {}
