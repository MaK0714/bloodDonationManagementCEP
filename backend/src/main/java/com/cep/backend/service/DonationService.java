package com.cep.backend.service;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.model.Donation;
import com.cep.backend.repository.BloodRequestRepository;
import com.cep.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public DonationService(DonationRepository donationRepository, BloodRequestRepository bloodRequestRepository) {
        this.donationRepository = donationRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    public Donation recordDonation(Donation donation) {
        if (donation.getDonorName() == null || donation.getDonorName().trim().isEmpty()) {
            donation.setDonorName("Anonymous Donor");
        }
        if (donation.getUnits() <= 0) {
            donation.setUnits(1);
        }

        // Live real-time linking: fulfill pending request from this hospital if blood group matches
        if (donation.getHospitalId() != null || donation.getHospitalName() != null) {
            Optional<BloodRequest> matchingReq = bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) &&
                    ((donation.getHospitalId() != null && donation.getHospitalId().equalsIgnoreCase(r.getHospitalId())) ||
                     (donation.getHospitalName() != null && donation.getHospitalName().equalsIgnoreCase(r.getHospitalName()))) &&
                    (donation.getBloodGroup() == null || donation.getBloodGroup().equalsIgnoreCase(r.getBloodGroup())))
                .findFirst();

            matchingReq.ifPresent(req -> {
                int newFulfilled = req.getUnitsFulfilled() + donation.getUnits();
                req.setUnitsFulfilled(newFulfilled);
                if (newFulfilled >= req.getUnitsNeeded()) {
                    req.setStatus("FULFILLED");
                }
                bloodRequestRepository.save(req);
            });
        }

        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll().stream()
                .sorted(Comparator.comparing(Donation::getDonatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Donation> getDonationsByDonor(String donorId) {
        return donationRepository.findByDonorId(donorId).stream()
                .sorted(Comparator.comparing(Donation::getDonatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<Donation> getDonationsByHospital(String hospitalId) {
        return donationRepository.findByHospitalId(hospitalId).stream()
                .sorted(Comparator.comparing(Donation::getDonatedAt).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Calculates donor clinical stats, including 90-day cooldown eligibility and impact counter.
     */
    public Map<String, Object> getDonorDonationSummary(String donorId) {
        List<Donation> donations = getDonationsByDonor(donorId);
        int totalUnits = donations.stream().mapToInt(Donation::getUnits).sum();
        int totalDonations = donations.size();

        Optional<Donation> latestDonation = donations.stream()
                .max(Comparator.comparing(Donation::getDonatedAt));

        boolean isEligible = true;
        long daysUntilEligible = 0;
        String nextEligibleDate = null;
        String lastDonatedAtStr = null;

        if (latestDonation.isPresent()) {
            LocalDateTime lastDate = latestDonation.get().getDonatedAt();
            lastDonatedAtStr = lastDate.toString();
            LocalDateTime eligibleDate = lastDate.plusDays(90);
            if (LocalDateTime.now().isBefore(eligibleDate)) {
                isEligible = false;
                daysUntilEligible = java.time.Duration.between(LocalDateTime.now(), eligibleDate).toDays() + 1;
                nextEligibleDate = eligibleDate.toLocalDate().toString();
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("donorId", donorId);
        summary.put("totalDonations", totalDonations);
        summary.put("totalUnits", totalUnits);
        summary.put("livesImpacted", totalUnits * 3);
        summary.put("isEligible", isEligible);
        summary.put("daysUntilEligible", daysUntilEligible);
        summary.put("nextEligibleDate", nextEligibleDate);
        summary.put("lastDonationDate", lastDonatedAtStr);
        summary.put("history", donations);
        return summary;
    }

    /**
     * Calculates hospital blood intake stats and lists recorded donation events.
     */
    public Map<String, Object> getHospitalDonationSummary(String hospitalId) {
        List<Donation> donations = getDonationsByHospital(hospitalId);
        int totalUnits = donations.stream().mapToInt(Donation::getUnits).sum();
        int totalDonations = donations.size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("hospitalId", hospitalId);
        summary.put("totalDonationsReceived", totalDonations);
        summary.put("totalUnitsReceived", totalUnits);
        summary.put("recentDonations", donations);
        return summary;
    }
}
