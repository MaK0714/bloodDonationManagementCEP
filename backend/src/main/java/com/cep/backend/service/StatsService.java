package com.cep.backend.service;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationEventRepository donationEventRepository;
    private final DonationRepository donationRepository;
    private final BloodDriveRepository bloodDriveRepository;

    private final DonationService donationService;

    public StatsService(UserRepository userRepository,
                        HospitalRepository hospitalRepository,
                        BloodRequestRepository bloodRequestRepository,
                        DonationEventRepository donationEventRepository,
                        DonationRepository donationRepository,
                        BloodDriveRepository bloodDriveRepository,
                        DonationService donationService) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.donationEventRepository = donationEventRepository;
        this.donationRepository = donationRepository;
        this.bloodDriveRepository = bloodDriveRepository;
        this.donationService = donationService;
    }

    public Map<String, Object> getLiveStats() {
        int totalDonors = userRepository.count();
        int totalHospitals = hospitalRepository.count();
        int totalRequests = bloodRequestRepository.count();
        int totalEvents = bloodDriveRepository.count();
        int totalDonations = donationRepository.count();

        int activeRequests = (int) bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();

        int totalUnitsNeeded = bloodRequestRepository.findAll().stream()
                .mapToInt(BloodRequest::getUnitsNeeded)
                .sum();

        int totalDonationUnits = donationRepository.findAll().stream()
                .mapToInt(com.cep.backend.model.Donation::getUnits)
                .sum();

        int totalUnitsFulfilled = Math.max(
                bloodRequestRepository.findAll().stream().mapToInt(BloodRequest::getUnitsFulfilled).sum(),
                totalDonationUnits
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDonors", totalDonors);
        stats.put("totalHospitals", totalHospitals);
        stats.put("totalRequests", totalRequests);
        stats.put("activeRequests", activeRequests);
        stats.put("totalEvents", totalEvents);
        stats.put("totalDonations", totalDonations);
        stats.put("totalUnitsNeeded", totalUnitsNeeded);
        stats.put("totalUnitsFulfilled", totalUnitsFulfilled);

        return stats;
    }

    /**
     * Real-time personal statistics for authenticated Donor/User.
     */
    public Map<String, Object> getDonorStats(String donorId) {
        Map<String, Object> res = new HashMap<>();
        Map<String, Object> global = getLiveStats();
        res.put("globalStats", global);
        res.put("role", "USER");

        java.util.Optional<com.cep.backend.model.User> userOpt = userRepository.findById(donorId);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(donorId);
        }

        if (userOpt.isEmpty()) {
            res.put("authenticated", false);
            return res;
        }

        com.cep.backend.model.User user = userOpt.get();
        res.put("authenticated", true);
        res.put("donorId", user.getId());
        res.put("name", user.getName());
        res.put("bloodGroup", user.getBloodGroup());
        res.put("city", user.getCity());

        Map<String, Object> donorSummary = donationService.getDonorDonationSummary(user.getId());
        res.put("totalDonations", donorSummary.get("totalDonations"));
        res.put("totalUnits", donorSummary.get("totalUnits"));
        res.put("livesImpacted", donorSummary.get("livesImpacted"));
        res.put("isEligible", donorSummary.get("isEligible"));
        res.put("daysUntilEligible", donorSummary.get("daysUntilEligible"));
        res.put("nextEligibleDate", donorSummary.get("nextEligibleDate"));
        res.put("lastDonationDate", donorSummary.get("lastDonationDate"));

        String userCity = user.getCity() != null ? user.getCity().trim() : "";
        String userBg = user.getBloodGroup() != null ? user.getBloodGroup().trim() : "";

        long matchingInCity = bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) &&
                        (userBg.isEmpty() || userBg.equalsIgnoreCase(r.getBloodGroup())) &&
                        (userCity.isEmpty() || userCity.equalsIgnoreCase(r.getCity())))
                .count();

        long matchingAcrossNetwork = bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) &&
                        (userBg.isEmpty() || userBg.equalsIgnoreCase(r.getBloodGroup())))
                .count();

        long activeRequestsInCity = bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) &&
                        (userCity.isEmpty() || userCity.equalsIgnoreCase(r.getCity())))
                .count();

        long activeDrivesInCity = bloodDriveRepository.findAll().stream()
                .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()) &&
                        (userCity.isEmpty() || userCity.equalsIgnoreCase(d.getCity())))
                .count();

        res.put("matchingInCity", matchingInCity);
        res.put("matchingAcrossNetwork", matchingAcrossNetwork);
        res.put("activeRequestsInCity", activeRequestsInCity);
        res.put("activeDrivesInCity", activeDrivesInCity);

        return res;
    }

    /**
     * Real-time operational statistics for authenticated Hospital.
     */
    public Map<String, Object> getHospitalStats(String hospitalId) {
        Map<String, Object> res = new HashMap<>();
        Map<String, Object> global = getLiveStats();
        res.put("globalStats", global);
        res.put("role", "HOSPITAL");

        java.util.Optional<com.cep.backend.model.Hospital> hospOpt = hospitalRepository.findById(hospitalId);
        if (hospOpt.isEmpty()) {
            hospOpt = hospitalRepository.findByEmail(hospitalId);
        }

        if (hospOpt.isEmpty()) {
            res.put("authenticated", false);
            return res;
        }

        com.cep.backend.model.Hospital hosp = hospOpt.get();
        res.put("authenticated", true);
        res.put("hospitalId", hosp.getId());
        res.put("name", hosp.getName());
        res.put("city", hosp.getCity());
        res.put("licenseNumber", hosp.getLicenseNumber());

        java.util.List<BloodRequest> myRequests = bloodRequestRepository.findAll().stream()
                .filter(r -> (hosp.getId() != null && hosp.getId().equalsIgnoreCase(r.getHospitalId())) ||
                             (hosp.getName() != null && hosp.getName().equalsIgnoreCase(r.getHospitalName())))
                .collect(java.util.stream.Collectors.toList());

        long activeRequests = myRequests.stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()))
                .count();

        long fulfilledRequests = myRequests.stream()
                .filter(r -> "FULFILLED".equalsIgnoreCase(r.getStatus()))
                .count();

        int unitsRequested = myRequests.stream().mapToInt(BloodRequest::getUnitsNeeded).sum();
        int unitsFulfilled = myRequests.stream().mapToInt(BloodRequest::getUnitsFulfilled).sum();

        Map<String, Object> hospDonations = donationService.getHospitalDonationSummary(hosp.getId());

        String city = hosp.getCity() != null ? hosp.getCity().trim() : "";
        long cityActiveRequests = bloodRequestRepository.findAll().stream()
                .filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) &&
                        (city.isEmpty() || city.equalsIgnoreCase(r.getCity())))
                .count();

        long cityDonors = userRepository.findAll().stream()
                .filter(u -> city.isEmpty() || city.equalsIgnoreCase(u.getCity()))
                .count();

        res.put("activeRequests", activeRequests);
        res.put("fulfilledRequests", fulfilledRequests);
        res.put("totalRequestsPosted", myRequests.size());
        res.put("unitsRequested", unitsRequested);
        res.put("unitsFulfilled", unitsFulfilled);
        res.put("donationsReceived", hospDonations.get("totalDonationsReceived"));
        res.put("cityActiveRequests", cityActiveRequests);
        res.put("cityDonors", cityDonors);

        return res;
    }

    /**
     * Real-time operational statistics for authenticated Blood Bank.
     */
    public Map<String, Object> getBloodBankStats(String bloodBankId) {
        Map<String, Object> res = new HashMap<>();
        Map<String, Object> global = getLiveStats();
        res.put("globalStats", global);
        res.put("role", "BLOOD_BANK");

        java.util.Optional<com.cep.backend.model.Hospital> bankOpt = hospitalRepository.findById(bloodBankId);
        if (bankOpt.isEmpty()) {
            bankOpt = hospitalRepository.findByEmail(bloodBankId);
        }

        if (bankOpt.isEmpty()) {
            res.put("authenticated", false);
            return res;
        }

        com.cep.backend.model.Hospital bank = bankOpt.get();
        res.put("authenticated", true);
        res.put("bloodBankId", bank.getId());
        res.put("name", bank.getName());
        res.put("city", bank.getCity());
        res.put("licenseNumber", bank.getLicenseNumber());

        java.util.List<com.cep.backend.model.BloodDrive> myDrives = bloodDriveRepository.findByBloodBankId(bank.getId());

        long activeDrivesHosted = myDrives.stream()
                .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()))
                .count();

        long completedDrivesHosted = myDrives.stream()
                .filter(d -> "COMPLETED".equalsIgnoreCase(d.getStatus()))
                .count();

        int registeredAttendees = myDrives.stream()
                .mapToInt(d -> d.getRegisteredDonors() != null ? d.getRegisteredDonors().size() : 0)
                .sum();

        String city = bank.getCity() != null ? bank.getCity().trim() : "";
        long activeDrivesInCity = bloodDriveRepository.findByCity(city).size();
        long cityDonors = userRepository.findAll().stream()
                .filter(u -> city.isEmpty() || city.equalsIgnoreCase(u.getCity()))
                .count();

        res.put("activeDrivesHosted", activeDrivesHosted);
        res.put("completedDrivesHosted", completedDrivesHosted);
        res.put("totalDrivesHosted", myDrives.size());
        res.put("registeredAttendees", registeredAttendees);
        res.put("activeDrivesInCity", activeDrivesInCity);
        res.put("cityDonors", cityDonors);

        return res;
    }
}
