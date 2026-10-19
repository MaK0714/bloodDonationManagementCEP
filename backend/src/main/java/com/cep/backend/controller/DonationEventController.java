package com.cep.backend.controller;

import com.cep.backend.model.DonationEvent;
import com.cep.backend.service.DonationEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class DonationEventController {

    private final DonationEventService donationEventService;

    public DonationEventController(DonationEventService donationEventService) {
        this.donationEventService = donationEventService;
    }

    @GetMapping
    public ResponseEntity<List<DonationEvent>> getAllEvents() {
        return ResponseEntity.ok(donationEventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationEvent> getEventById(@PathVariable String id) {
        return donationEventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DonationEvent> createEvent(@RequestBody DonationEvent event) {
        DonationEvent created = donationEventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<DonationEvent> registerForEvent(@PathVariable String id,
                                                          @RequestBody(required = false) Map<String, Object> body) {
        String donorName = "Registered Donor";
        if (body != null && body.containsKey("donorName") && body.get("donorName") != null) {
            donorName = body.get("donorName").toString();
        }

        Optional<DonationEvent> updated = donationEventService.registerDonor(id, donorName);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

