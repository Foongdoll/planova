package com.foongdoll.portfolio.planovabe.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record UpdateCalendarEventRequest(
    String title,
    String description,
    LocalDate startDate,
    LocalTime startTime,
    LocalDate endDate,
    LocalTime endTime,
    Boolean allDay,
    String color
) {}
