package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.request.CreateCalendarEventRequest;
import com.foongdoll.portfolio.planovabe.dto.request.UpdateCalendarEventRequest;
import com.foongdoll.portfolio.planovabe.dto.response.CalendarEventResponse;
import com.foongdoll.portfolio.planovabe.entity.CalendarEvent;
import com.foongdoll.portfolio.planovabe.entity.User;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.CalendarEventRepository;
import com.foongdoll.portfolio.planovabe.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository, UserRepository userRepository) {
        this.calendarEventRepository = calendarEventRepository;
        this.userRepository = userRepository;
    }

    public List<CalendarEventResponse> getEvents(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return calendarEventRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
                    .map(CalendarEventResponse::from)
                    .toList();
        }
        return calendarEventRepository.findByUserIdOrderByStartDateAsc(userId).stream()
                .map(CalendarEventResponse::from)
                .toList();
    }

    @Transactional
    public CalendarEventResponse createEvent(Long userId, CreateCalendarEventRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        CalendarEvent event = CalendarEvent.builder()
                .user(user)
                .title(request.title())
                .description(request.description())
                .startDate(request.startDate())
                .startTime(request.startTime())
                .endDate(request.endDate())
                .endTime(request.endTime())
                .allDay(request.allDay() != null ? request.allDay() : true)
                .color(request.color())
                .build();

        return CalendarEventResponse.from(calendarEventRepository.save(event));
    }

    @Transactional
    public CalendarEventResponse updateEvent(Long userId, Long eventId, UpdateCalendarEventRequest request) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found: " + eventId));

        if (!event.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Calendar event not found: " + eventId);
        }

        if (request.title() != null) event.setTitle(request.title());
        if (request.description() != null) event.setDescription(request.description());
        if (request.startDate() != null) event.setStartDate(request.startDate());
        if (request.startTime() != null) event.setStartTime(request.startTime());
        if (request.endDate() != null) event.setEndDate(request.endDate());
        if (request.endTime() != null) event.setEndTime(request.endTime());
        if (request.allDay() != null) event.setAllDay(request.allDay());
        if (request.color() != null) event.setColor(request.color().isEmpty() ? null : request.color());

        return CalendarEventResponse.from(calendarEventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long userId, Long eventId) {
        CalendarEvent event = calendarEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found: " + eventId));

        if (!event.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Calendar event not found: " + eventId);
        }

        calendarEventRepository.delete(event);
    }
}
