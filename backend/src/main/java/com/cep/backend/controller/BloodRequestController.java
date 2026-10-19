package com.cep.backend.controller;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.service.BloodRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllRequests(
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "bloodGroup", required = false) String bloodGroup,
            @RequestParam(value = "urgency", required = false) String urgency,
            @RequestParam(value = "status", required = false) String status) {
        if (city != null || bloodGroup != null || urgency != null || status != null) {
            return ResponseEntity.ok(bloodRequestService.getFilteredRequests(city, bloodGroup, urgency, status));
        }
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @GetMapping("/stats/blood-groups")
    public ResponseEntity<Map<String, Integer>> getDemandsByBloodGroup() {
        return ResponseEntity.ok(bloodRequestService.getDemandsByBloodGroup());
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<BloodRequest>> getRequestsByHospital(@PathVariable("hospitalId") String hospitalId) {
        return ResponseEntity.ok(bloodRequestService.getRequestsByHospital(hospitalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodRequest> getRequestById(@PathVariable("id") String id) {
        return bloodRequestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequest request) {
        BloodRequest created = bloodRequestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/fulfill")
    public ResponseEntity<BloodRequest> fulfillRequest(@PathVariable("id") String id) {
        return bloodRequestService.fulfillRequest(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRequest(@PathVariable("id") String id) {
        boolean deleted = bloodRequestService.deleteRequest(id);
        return deleted
                ? ResponseEntity.ok(Map.of("success", true, "message", "Request removed."))
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Request not found."));
    }

    @PostMapping("/{id}/pledge")
    public ResponseEntity<BloodRequest> pledgeDonation(@PathVariable("id") String id,
                                                       @RequestBody(required = false) Map<String, Object> body) {
        int units = 1;
        String donorName = "Anonymous Donor";
        if (body != null) {
            if (body.containsKey("units")) {
                units = Integer.parseInt(body.get("units").toString());
            }
            if (body.containsKey("donorName") && body.get("donorName") != null) {
                donorName = body.get("donorName").toString();
            }
        }

        Optional<BloodRequest> updated = bloodRequestService.pledgeDonation(id, units, donorName);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
