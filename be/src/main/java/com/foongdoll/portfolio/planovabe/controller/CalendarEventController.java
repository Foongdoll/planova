package com.foongdoll.portfolio.planovabe.controller;

import com.foongdoll.portfolio.planovabe.dto.request.CreateCalendarEventRequest;
import com.foongdoll.portfolio.planovabe.dto.request.UpdateCalendarEventRequest;
import com.foongdoll.portfolio.planovabe.dto.response.CalendarEventResponse;
import com.foongdoll.portfolio.planovabe.security.UserPrincipal;
import com.foongdoll.portfolio.planovabe.service.CalendarEventService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar/events")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(calendarEventService.getEvents(principal.id(), startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<CalendarEventResponse> createEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateCalendarEventRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(calendarEventService.createEvent(principal.id(), request));
    }

    @PatchMapping("/{eventId}")
    public ResponseEntity<CalendarEventResponse> updateEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long eventId,
            @RequestBody UpdateCalendarEventRequest request
    ) {
        return ResponseEntity.ok(calendarEventService.updateEvent(principal.id(), eventId, request));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long eventId
    ) {
        calendarEventService.deleteEvent(principal.id(), eventId);
        return ResponseEntity.noContent().build();
    }
}
