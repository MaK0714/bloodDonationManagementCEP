package com.cep.backend.service;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.model.Donation;
import com.cep.backend.model.Hospital;
import com.cep.backend.model.Role;
import com.cep.backend.repository.BloodRequestRepository;
import com.cep.backend.repository.DonationRepository;
import com.cep.backend.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Backend-heavy service for Hospital registration, verification,
 * and live aggregation of hospital demands, requests, and donation records.
 */
@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationRepository donationRepository;

    public HospitalService(HospitalRepository hospitalRepository,
                           BloodRequestRepository bloodRequestRepository,
                           DonationRepository donationRepository) {
        this.hospitalRepository = hospitalRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.donationRepository = donationRepository;
    }

    /**
     * Get all verified registered hospitals, enriched with real live backend data:
     * active blood requests, donation counts, and demand status.
     */
    public List<Map<String, Object>> getRegisteredHospitals(String cityFilter) {
        return getRegisteredHospitals(cityFilter, null, null);
    }

    /**
     * Get all verified registered hospitals, enriched with real live backend data,
     * filtered by optional city, blood group requirement, and search term.
     */
    public List<Map<String, Object>> getRegisteredHospitals(String cityFilter, String bloodGroupFilter, String search) {
        List<Hospital> hospitals = hospitalRepository.findByType("HOSPITAL");

        if (cityFilter != null && !cityFilter.trim().isEmpty() && !"ALL".equalsIgnoreCase(cityFilter)) {
            hospitals = hospitals.stream()
                .filter(h -> cityFilter.equalsIgnoreCase(h.getCity()))
                .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            hospitals = hospitals.stream()
                .filter(h -> (h.getName() != null && h.getName().toLowerCase().contains(q)) ||
                             (h.getAddress() != null && h.getAddress().toLowerCase().contains(q)) ||
                             (h.getCity() != null && h.getCity().toLowerCase().contains(q)))
                .collect(Collectors.toList());
        }

        List<Map<String, Object>> enriched = hospitals.stream()
            .filter(Hospital::isVerified)
            .map(this::enrichHospitalData)
            .collect(Collectors.toList());

        if (bloodGroupFilter != null && !bloodGroupFilter.trim().isEmpty() && !"ALL".equalsIgnoreCase(bloodGroupFilter)) {
            enriched = enriched.stream()
                .filter(m -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> reqs = (List<Map<String, Object>>) m.get("activeRequests");
                    return reqs != null && reqs.stream().anyMatch(r -> bloodGroupFilter.equalsIgnoreCase((String) r.get("bloodGroup")));
                })
                .collect(Collectors.toList());
        }

        return enriched;
    }

    /**
     * Get a single registered hospital profile by ID, enriched with live requirements.
     */
    public Optional<Map<String, Object>> getHospitalById(String id) {
        return hospitalRepository.findById(id)
            .filter(Hospital::isVerified)
            .map(this::enrichHospitalData);
    }

    /**
     * Validates and registers a new hospital into the backend repository.
     */
    public Map<String, Object> registerHospital(Hospital hospital) {
        Map<String, Object> response = new HashMap<>();

        if (hospital.getName() == null || hospital.getName().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Hospital name is required.");
            return response;
        }

        if (hospital.getEmail() == null || hospital.getEmail().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Official email is required.");
            return response;
        }

        String email = hospital.getEmail().trim().toLowerCase();
        if (hospitalRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "A hospital with this email is already registered.");
            return response;
        }

        if (hospital.getLicenseNumber() == null || hospital.getLicenseNumber().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Medical license number is required for portal authentication.");
            return response;
        }

        if (hospital.getPassword() == null || hospital.getPassword().trim().length() < 4) {
            response.put("success", false);
            response.put("message", "Password must be at least 4 characters.");
            return response;
        }

        // Set official credentials and auto-verify valid registrations
        hospital.setId("HOSP-" + System.currentTimeMillis());
        hospital.setEmail(email);
        hospital.setPassword(hospital.getPassword().trim());
        hospital.setType("HOSPITAL");
        hospital.setRole(Role.HOSPITAL);
        hospital.setVerified(true);

        if (hospital.getCity() == null || hospital.getCity().trim().isEmpty()) {
            hospital.setCity("Mumbai");
        } else {
            hospital.setCity(hospital.getCity().trim());
        }

        hospitalRepository.save(hospital);

        response.put("success", true);
        response.put("message", "Hospital registered and verified successfully!");
        response.put("hospital", enrichHospitalData(hospital));
        return response;
    }

    /**
     * Backend-heavy aggregation: merges the hospital registration entity with:
     * 1. Active blood requests submitted by this hospital.
     * 2. Live donation units recorded by donors for this hospital.
     * 3. Overall demand status (CRITICAL, HIGH, NORMAL, STABLE).
     */
    private Map<String, Object> enrichHospitalData(Hospital h) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", h.getId());
        map.put("name", h.getName());
        map.put("licenseNumber", h.getLicenseNumber());
        map.put("email", h.getEmail());
        map.put("phone", h.getPhone() != null ? h.getPhone() : "");
        map.put("address", h.getAddress() != null ? h.getAddress() : "");
        map.put("city", h.getCity() != null ? h.getCity() : "");
        map.put("type", h.getType());
        map.put("verified", h.isVerified());

        // 1. Fetch live active blood requests posted by this hospital
        List<BloodRequest> hospitalRequests = bloodRequestRepository.findAll().stream()
            .filter(r -> ((h.getId() != null && h.getId().equalsIgnoreCase(r.getHospitalId())) ||
                          (h.getName() != null && h.getName().equalsIgnoreCase(r.getHospitalName())))
                         && "ACTIVE".equalsIgnoreCase(r.getStatus()))
            .collect(Collectors.toList());

        List<Map<String, Object>> activeReqSummaries = new ArrayList<>();
        int totalUnitsNeeded = 0;
        boolean hasCritical = false;

        for (BloodRequest req : hospitalRequests) {
            int remaining = Math.max(0, req.getUnitsNeeded() - req.getUnitsFulfilled());
            if (remaining > 0) {
                totalUnitsNeeded += remaining;
                if ("CRITICAL".equalsIgnoreCase(req.getUrgency())) {
                    hasCritical = true;
                }
                Map<String, Object> reqInfo = new HashMap<>();
                reqInfo.put("id", req.getId());
                reqInfo.put("bloodGroup", req.getBloodGroup());
                reqInfo.put("unitsNeeded", remaining);
                reqInfo.put("urgency", req.getUrgency());
                reqInfo.put("note", req.getNote());
                activeReqSummaries.add(reqInfo);
            }
        }
        map.put("activeRequests", activeReqSummaries);
        map.put("totalUnitsNeeded", totalUnitsNeeded);
        map.put("urgencyStatus", hasCritical ? "CRITICAL" : (totalUnitsNeeded > 0 ? "HIGH" : "STABLE"));

        // 2. Fetch donations recorded for this hospital in backend
        List<Donation> donations = donationRepository.findByHospitalId(h.getId());
        int totalDonations = donations.stream().mapToInt(Donation::getUnits).sum();
        map.put("totalDonationsReceived", totalDonations);

        return map;
    }

    public Optional<Map<String, Object>> updateHospital(String id, Hospital updated) {
        Optional<Hospital> opt = hospitalRepository.findById(id);
        if (opt.isPresent()) {
            Hospital h = opt.get();
            if (updated.getName() != null && !updated.getName().trim().isEmpty()) {
                h.setName(updated.getName().trim());
            }
            if (updated.getAddress() != null && !updated.getAddress().trim().isEmpty()) {
                h.setAddress(updated.getAddress().trim());
            }
            if (updated.getPhone() != null && !updated.getPhone().trim().isEmpty()) {
                h.setPhone(updated.getPhone().trim());
            }
            if (updated.getCity() != null && !updated.getCity().trim().isEmpty()) {
                h.setCity(updated.getCity().trim());
            }
            hospitalRepository.save(h);
            return Optional.of(enrichHospitalData(h));
        }
        return Optional.empty();
    }
}

