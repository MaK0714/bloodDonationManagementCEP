package com.cep.backend.controller;

import com.cep.backend.model.Hospital;
import com.cep.backend.repository.HospitalRepository;
import com.cep.backend.service.HospitalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;
    private final HospitalRepository hospitalRepository;

    public HospitalController(HospitalService hospitalService, HospitalRepository hospitalRepository) {
        this.hospitalService = hospitalService;
        this.hospitalRepository = hospitalRepository;
    }

    /**
     * All registered, verified hospitals enriched with live backend data:
     * active requests, total donations, and demand status. Supports filtering.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllHospitals(
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "bloodGroup", required = false) String bloodGroup,
            @RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(hospitalService.getRegisteredHospitals(city, bloodGroup, search));
    }

    /**
     * Verified registered hospitals in a specific city with live requirements.
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Map<String, Object>>> getByCity(@PathVariable("city") String city) {
        return ResponseEntity.ok(hospitalService.getRegisteredHospitals(city));
    }

    /**
     * Details for a single registered hospital by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {
        return hospitalService.getHospitalById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hospital not found or not verified.")));
    }

    /**
     * Hospital registration endpoint with medical license validation.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Hospital hospital) {
        Map<String, Object> result = hospitalService.registerHospital(hospital);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return success
            ? ResponseEntity.status(HttpStatus.CREATED).body(result)
            : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * Update hospital details (phone, address) from hospital portal.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody Hospital hospital) {
        return hospitalService.updateHospital(id, hospital)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Hospital not found.")));
    }

    /**
     * All verified registered blood banks.
     */
    @GetMapping("/bloodbanks")
    public ResponseEntity<List<Map<String, Object>>> getAllBloodBanks() {
        List<Map<String, Object>> result = hospitalRepository.findByType("BLOOD_BANK")
            .stream().map(this::toPublicProfile).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> toPublicProfile(Hospital h) {
        Map<String, Object> p = new HashMap<>();
        p.put("id", h.getId());
        p.put("name", h.getName());
        p.put("type", h.getType());
        p.put("city", h.getCity());
        p.put("address", h.getAddress());
        p.put("phone", h.getPhone());
        p.put("licenseNumber", h.getLicenseNumber());
        p.put("verified", h.isVerified());
        return p;
    }
}
