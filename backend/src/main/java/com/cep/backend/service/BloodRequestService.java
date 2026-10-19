package com.cep.backend.service;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.repository.BloodRequestRepository;
import com.cep.backend.model.Donation;
import com.cep.backend.repository.DonationRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final DonationRepository donationRepository;

    public BloodRequestService(BloodRequestRepository bloodRequestRepository,
                               DonationRepository donationRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.donationRepository = donationRepository;
    }

    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll().stream()
                .sorted(Comparator.comparing(BloodRequest::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<BloodRequest> getFilteredRequests(String city, String bloodGroup, String urgency, String status) {
        return bloodRequestRepository.findAll().stream()
                .filter(r -> (city == null || city.trim().isEmpty() || "ALL".equalsIgnoreCase(city) || city.equalsIgnoreCase(r.getCity())))
                .filter(r -> (bloodGroup == null || bloodGroup.trim().isEmpty() || "ALL".equalsIgnoreCase(bloodGroup) || bloodGroup.equalsIgnoreCase(r.getBloodGroup())))
                .filter(r -> (urgency == null || urgency.trim().isEmpty() || "ALL".equalsIgnoreCase(urgency) || urgency.equalsIgnoreCase(r.getUrgency())))
                .filter(r -> (status == null || status.trim().isEmpty() || "ALL".equalsIgnoreCase(status) || status.equalsIgnoreCase(r.getStatus())))
                .sorted(Comparator.comparing(BloodRequest::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<BloodRequest> getRequestsByHospital(String hospitalId) {
        if (hospitalId == null) return List.of();
        return bloodRequestRepository.findAll().stream()
                .filter(r -> hospitalId.equalsIgnoreCase(r.getHospitalId()))
                .sorted(Comparator.comparing(BloodRequest::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<BloodRequest> getRequestById(String id) {
        return bloodRequestRepository.findById(id);
    }

    public BloodRequest createRequest(BloodRequest request) {
        if (request.getHospitalName() == null || request.getHospitalName().trim().isEmpty()) {
            request.setHospitalName("Authorized General Hospital");
        }
        if (request.getUrgency() == null || request.getUrgency().trim().isEmpty()) {
            request.setUrgency("HIGH");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            request.setStatus("ACTIVE");
        }
        return bloodRequestRepository.save(request);
    }

    public Optional<BloodRequest> fulfillRequest(String id) {
        Optional<BloodRequest> opt = bloodRequestRepository.findById(id);
        if (opt.isPresent()) {
            BloodRequest req = opt.get();
            req.setStatus("FULFILLED");
            req.setUnitsFulfilled(req.getUnitsNeeded());
            bloodRequestRepository.save(req);
            return Optional.of(req);
        }
        return Optional.empty();
    }

    public boolean deleteRequest(String id) {
        return bloodRequestRepository.delete(id);
    }

    public Optional<BloodRequest> pledgeDonation(String requestId, int units, String donorName) {
        Optional<BloodRequest> opt = bloodRequestRepository.findById(requestId);
        if (opt.isPresent()) {
            BloodRequest req = opt.get();
            int newFulfilled = req.getUnitsFulfilled() + units;
            req.setUnitsFulfilled(newFulfilled);
            if (newFulfilled >= req.getUnitsNeeded()) {
                req.setStatus("FULFILLED");
            }
            bloodRequestRepository.save(req);

            Donation donation = new Donation(
                "DON-" + System.currentTimeMillis(),
                null,
                donorName != null ? donorName : "Pledged Donor",
                null,
                req.getBloodGroup(),
                req.getHospitalId(),
                req.getHospitalName(),
                req.getCity(),
                units
            );
            donationRepository.save(donation);

            return Optional.of(req);
        }
        return Optional.empty();
    }

    /**
     * Aggregates active unmet blood demands grouped by blood group (e.g. O+, O-, A+...)
     */
    public Map<String, Integer> getDemandsByBloodGroup() {
        Map<String, Integer> map = new LinkedHashMap<>();
        for (String bg : List.of("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-")) {
            map.put(bg, 0);
        }

        bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .forEach(r -> {
                    int needed = Math.max(0, r.getUnitsNeeded() - r.getUnitsFulfilled());
                    if (r.getBloodGroup() != null && needed > 0) {
                        map.merge(r.getBloodGroup(), needed, Integer::sum);
                    }
                });

        return map;
    }
}
