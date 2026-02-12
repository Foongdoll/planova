package com.foongdoll.portfolio.planovabe.dto.response;

import com.foongdoll.portfolio.planovabe.entity.CalendarEvent;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public record CalendarEventResponse(
    Long id,
    String title,
    String description,
    LocalDate startDate,
    LocalTime startTime,
    LocalDate endDate,
    LocalTime endTime,
    Boolean allDay,
    String color,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static CalendarEventResponse from(CalendarEvent event) {
        return new CalendarEventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getStartDate(),
            event.getStartTime(),
            event.getEndDate(),
            event.getEndTime(),
            event.getAllDay(),
            event.getColor(),
            event.getCreatedAt(),
            event.getUpdatedAt()
        );
    }
}
