package com.cep.backend.controller;

import com.cep.backend.model.BloodDrive;
import com.cep.backend.service.BloodDriveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/drives")
public class BloodDriveController {

    private final BloodDriveService driveService;

    public BloodDriveController(BloodDriveService driveService) {
        this.driveService = driveService;
    }

    /** All active blood drives with optional city & search filtering */
    @GetMapping
    public ResponseEntity<List<BloodDrive>> getAllActive(
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "search", required = false) String search) {
        if ((city != null && !city.trim().isEmpty()) || (search != null && !search.trim().isEmpty())) {
            return ResponseEntity.ok(driveService.filterDrives(city, search));
        }
        return ResponseEntity.ok(driveService.getAllActive());
    }

    /** Active blood drives filtered by city */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<BloodDrive>> getByCity(@PathVariable("city") String city) {
        return ResponseEntity.ok(driveService.getByCity(city));
    }

    /** All drives for a specific blood bank (authenticated view) */
    @GetMapping("/bank/{bloodBankId}")
    public ResponseEntity<List<BloodDrive>> getByBloodBank(@PathVariable("bloodBankId") String bloodBankId) {
        return ResponseEntity.ok(driveService.getByBloodBank(bloodBankId));
    }

    /** Blood bank posts a new drive */
    @PostMapping
    public ResponseEntity<BloodDrive> createDrive(@RequestBody BloodDrive drive) {
        if (drive.getBloodBankId() == null || drive.getLocation() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        BloodDrive created = driveService.createDrive(drive);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** Mark drive as completed */
    @PutMapping("/{id}/complete")
    public ResponseEntity<BloodDrive> completeDrive(@PathVariable("id") String id) {
        return driveService.completeDrive(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Delete or cancel a drive */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDrive(@PathVariable("id") String id) {
        boolean deleted = driveService.deleteDrive(id);
        return deleted
            ? ResponseEntity.ok(Map.of("success", true, "message", "Collection drive removed."))
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Drive not found."));
    }

    /** Donor registers to attend an active blood drive */
    @PostMapping("/{id}/register")
    public ResponseEntity<BloodDrive> registerForDrive(@PathVariable("id") String id, @RequestBody(required = false) Map<String, String> body) {
        String donorName = (body != null && body.containsKey("donorName")) ? body.get("donorName") : "Registered Donor";
        Optional<BloodDrive> updated = driveService.registerDonor(id, donorName);
        return updated.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
