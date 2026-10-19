package com.cep.backend.controller;

import com.cep.backend.model.Donation;
import com.cep.backend.service.DonationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    /**
     * Record a new blood donation to a registered hospital
     */
    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody Donation donation) {
        Donation saved = donationService.recordDonation(donation);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Get all recorded donations
     */
    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    /**
     * Get donation history for a specific donor
     */
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getByDonor(@PathVariable("donorId") String donorId) {
        return ResponseEntity.ok(donationService.getDonationsByDonor(donorId));
    }

    /**
     * Get rich donation summary and cooldown eligibility for a donor
     */
    @GetMapping("/donor/{donorId}/summary")
    public ResponseEntity<Map<String, Object>> getDonorSummary(@PathVariable("donorId") String donorId) {
        return ResponseEntity.ok(donationService.getDonorDonationSummary(donorId));
    }

    /**
     * Get donations received by a specific hospital
     */
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Donation>> getByHospital(@PathVariable("hospitalId") String hospitalId) {
        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
    }

    /**
     * Get hospital donation intake summary
     */
    @GetMapping("/hospital/{hospitalId}/summary")
    public ResponseEntity<Map<String, Object>> getHospitalSummary(@PathVariable("hospitalId") String hospitalId) {
        return ResponseEntity.ok(donationService.getHospitalDonationSummary(hospitalId));
    }
}
