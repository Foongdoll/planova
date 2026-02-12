package com.foongdoll.portfolio.planovabe.controller;

import com.foongdoll.portfolio.planovabe.dto.response.TaskResponse;
import com.foongdoll.portfolio.planovabe.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping("/api/projects/{projectId}/recalculate")
    public ResponseEntity<List<TaskResponse>> recalculate(@PathVariable Long projectId) {
        return ResponseEntity.ok(scheduleService.recalculate(projectId));
    }
}
