package com.cep.backend.controller;

import com.cep.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getLiveStats() {
        return ResponseEntity.ok(statsService.getLiveStats());
    }

    @GetMapping("/donor/{id}")
    public ResponseEntity<Map<String, Object>> getDonorStats(@org.springframework.web.bind.annotation.PathVariable("id") String id) {
        return ResponseEntity.ok(statsService.getDonorStats(id));
    }

    @GetMapping("/hospital/{id}")
    public ResponseEntity<Map<String, Object>> getHospitalStats(@org.springframework.web.bind.annotation.PathVariable("id") String id) {
        return ResponseEntity.ok(statsService.getHospitalStats(id));
    }

    @GetMapping("/bloodbank/{id}")
    public ResponseEntity<Map<String, Object>> getBloodBankStats(@org.springframework.web.bind.annotation.PathVariable("id") String id) {
        return ResponseEntity.ok(statsService.getBloodBankStats(id));
    }
}

