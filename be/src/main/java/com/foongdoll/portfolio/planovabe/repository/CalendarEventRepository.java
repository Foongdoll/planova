package com.foongdoll.portfolio.planovabe.repository;

import com.foongdoll.portfolio.planovabe.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByUserIdOrderByStartDateAsc(Long userId);

    @Query("SELECT e FROM CalendarEvent e WHERE e.user.id = :userId AND e.startDate <= :endDate AND e.endDate >= :startDate ORDER BY e.startDate ASC")
    List<CalendarEvent> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
