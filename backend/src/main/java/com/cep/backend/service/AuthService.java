package com.cep.backend.service;

import com.cep.backend.model.*;
import com.cep.backend.repository.HospitalRepository;
import com.cep.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;

    public AuthService(UserRepository userRepository, HospitalRepository hospitalRepository) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
    }

    // ── Unified login (dispatches by userType or auto-detects) ───────────
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new LoginResponse(false, "Email and password are required.", null, null, null);
        }

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();
        String userType = request.getUserType();

        if ("HOSPITAL".equalsIgnoreCase(userType)) {
            return loginHospital(email, password);
        } else if ("BLOOD_BANK".equalsIgnoreCase(userType) || "BLOODBANK".equalsIgnoreCase(userType)) {
            return loginBloodBank(email, password);
        } else if ("USER".equalsIgnoreCase(userType) || "DONOR".equalsIgnoreCase(userType)) {
            return loginUser(email, password);
        }

        // Smart auto-discovery if userType wasn't explicitly specified
        if (userRepository.findByEmail(email).isPresent()) {
            return loginUser(email, password);
        }
        Optional<Hospital> hospOpt = hospitalRepository.findByEmail(email);
        if (hospOpt.isPresent()) {
            if ("BLOOD_BANK".equalsIgnoreCase(hospOpt.get().getType())) {
                return loginBloodBank(email, password);
            }
            return loginHospital(email, password);
        }

        return new LoginResponse(false, "No account registered with this email.", null, null, null);
    }

    // ── User / Donor login ─────────────────────────────────────────────────
    public LoginResponse loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            if ("donor@blood.org".equalsIgnoreCase(email) && "donor123".equals(password)) {
                User demoUser = new User("USR-DEMO", "Demo Donor", "donor@blood.org", "donor123", "O+", "+91 98765 43210", "Mumbai");
                demoUser.setRole(Role.USER);
                userRepository.save(demoUser);
                userOpt = Optional.of(demoUser);
            } else {
                return new LoginResponse(false, "User account not found with this email.", "USER", null, null);
            }
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            return new LoginResponse(false, "Invalid password.", "USER", null, null);
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("bloodGroup", user.getBloodGroup());
        profile.put("phone", user.getPhone());
        profile.put("city", user.getCity());
        profile.put("role", user.getRole().name());

        String token = "USER-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Welcome back, " + user.getName() + "!", "USER", profile, token);
    }

    // ── Hospital login (verified hospitals only) ────────────────────────────
    public LoginResponse loginHospital(String email, String password) {
        Optional<Hospital> hospitalOpt = hospitalRepository.findByEmail(email);

        if (hospitalOpt.isEmpty()) {
            if ("hospital@care.org".equalsIgnoreCase(email) && "hosp123".equals(password)) {
                Hospital demoHosp = new Hospital("HOSP-DEMO", "KEM Hospital & Blood Centre", "LIC-MH-2024-9981", "hospital@care.org", "hosp123", "+91 22 2456 7890", "124 Medical Campus Road, Parel", "Mumbai");
                demoHosp.setType("HOSPITAL");
                demoHosp.setRole(Role.HOSPITAL);
                demoHosp.setVerified(true);
                hospitalRepository.save(demoHosp);
                hospitalOpt = Optional.of(demoHosp);
            } else {
                return new LoginResponse(false, "Hospital account not found.", "HOSPITAL", null, null);
            }
        }

        Hospital hospital = hospitalOpt.get();

        // Reject blood banks trying to use the hospital login endpoint
        if ("BLOOD_BANK".equalsIgnoreCase(hospital.getType())) {
            return new LoginResponse(false, "Please use the Blood Bank login page.", "HOSPITAL", null, null);
        }

        if (!hospital.getPassword().equals(password)) {
            return new LoginResponse(false, "Invalid password.", "HOSPITAL", null, null);
        }

        if (!hospital.isVerified()) {
            return new LoginResponse(false, "Your hospital is not yet verified by admin. Please wait for verification.", "HOSPITAL", null, null);
        }

        Map<String, Object> profile = buildHospitalProfile(hospital);
        String token = "HOSP-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Welcome, " + hospital.getName() + "!", "HOSPITAL", profile, token);
    }

    // ── Blood Bank login (verified blood banks only) ────────────────────────
    public LoginResponse loginBloodBank(String email, String password) {
        Optional<Hospital> bankOpt = hospitalRepository.findByEmail(email);

        if (bankOpt.isEmpty()) {
            if ("bank@bloodplus.org".equalsIgnoreCase(email) && "bank123".equals(password)) {
                Hospital demoBank = new Hospital("BANK-DEMO", "BloodPlus Central Bank", "LIC-BB-2024-4421", "bank@bloodplus.org", "bank123", "+91 22 6677 8899", "55 Donation Avenue, Andheri", "Mumbai");
                demoBank.setType("BLOOD_BANK");
                demoBank.setRole(Role.HOSPITAL);
                demoBank.setVerified(true);
                hospitalRepository.save(demoBank);
                bankOpt = Optional.of(demoBank);
            } else {
                return new LoginResponse(false, "Blood bank account not found.", "BLOOD_BANK", null, null);
            }
        }

        Hospital bank = bankOpt.get();

        // Reject hospitals trying to use the blood bank endpoint
        if (!"BLOOD_BANK".equalsIgnoreCase(bank.getType())) {
            return new LoginResponse(false, "Please use the Hospital login page.", "BLOOD_BANK", null, null);
        }

        if (!bank.getPassword().equals(password)) {
            return new LoginResponse(false, "Invalid password.", "BLOOD_BANK", null, null);
        }

        if (!bank.isVerified()) {
            return new LoginResponse(false, "Your blood bank is not yet verified by admin.", "BLOOD_BANK", null, null);
        }

        Map<String, Object> profile = buildHospitalProfile(bank);
        String token = "BANK-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Welcome, " + bank.getName() + "!", "BLOOD_BANK", profile, token);
    }

    // ── User Registration ───────────────────────────────────────────────────
    public LoginResponse registerUser(RegisterRequest req) {
        if (req.getName() == null || req.getEmail() == null || req.getPassword() == null) {
            return new LoginResponse(false, "Name, email and password are required.", "USER", null, null);
        }

        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return new LoginResponse(false, "An account with this email already exists.", "USER", null, null);
        }

        User user = new User();
        user.setId("USR-" + System.currentTimeMillis());
        user.setName(req.getName().trim());
        user.setEmail(email);
        user.setPassword(req.getPassword().trim());
        user.setBloodGroup(req.getBloodGroup() != null ? req.getBloodGroup().trim() : "O+");
        user.setPhone(req.getPhone() != null ? req.getPhone().trim() : "");
        user.setCity(req.getCity() != null ? req.getCity().trim() : "Mumbai");
        user.setRole(Role.USER);

        userRepository.save(user);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("bloodGroup", user.getBloodGroup());
        profile.put("phone", user.getPhone());
        profile.put("city", user.getCity());
        profile.put("role", user.getRole().name());

        String token = "USER-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Account created successfully! Welcome, " + user.getName() + "!", "USER", profile, token);
    }

    // ── Hospital Registration ───────────────────────────────────────────────
    public LoginResponse registerHospital(Hospital hospital) {
        if (hospital.getName() == null || hospital.getEmail() == null || hospital.getPassword() == null) {
            return new LoginResponse(false, "Name, email and password are required.", "HOSPITAL", null, null);
        }

        String email = hospital.getEmail().trim().toLowerCase();
        if (hospitalRepository.existsByEmail(email)) {
            return new LoginResponse(false, "A hospital account with this email already exists.", "HOSPITAL", null, null);
        }

        hospital.setId("HOSP-" + System.currentTimeMillis());
        hospital.setEmail(email);
        hospital.setType("HOSPITAL");
        hospital.setVerified(true); // Auto-verified for instant portal usability
        hospital.setRole(Role.HOSPITAL);
        if (hospital.getCity() == null || hospital.getCity().trim().isEmpty()) {
            hospital.setCity("Mumbai");
        }

        hospitalRepository.save(hospital);
        Map<String, Object> profile = buildHospitalProfile(hospital);
        String token = "HOSP-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Hospital registered successfully! Authorized: " + hospital.getName(), "HOSPITAL", profile, token);
    }

    // ── Blood Bank Registration ─────────────────────────────────────────────
    public LoginResponse registerBloodBank(Hospital bloodBank) {
        if (bloodBank.getName() == null || bloodBank.getEmail() == null || bloodBank.getPassword() == null) {
            return new LoginResponse(false, "Name, email and password are required.", "BLOOD_BANK", null, null);
        }

        String email = bloodBank.getEmail().trim().toLowerCase();
        if (hospitalRepository.existsByEmail(email)) {
            return new LoginResponse(false, "A blood bank account with this email already exists.", "BLOOD_BANK", null, null);
        }

        bloodBank.setId("BANK-" + System.currentTimeMillis());
        bloodBank.setEmail(email);
        bloodBank.setType("BLOOD_BANK");
        bloodBank.setVerified(true);
        bloodBank.setRole(Role.HOSPITAL);
        if (bloodBank.getCity() == null || bloodBank.getCity().trim().isEmpty()) {
            bloodBank.setCity("Mumbai");
        }

        hospitalRepository.save(bloodBank);
        Map<String, Object> profile = buildHospitalProfile(bloodBank);
        String token = "BANK-TOKEN-" + UUID.randomUUID();
        return new LoginResponse(true, "Blood Bank registered successfully! Authorized: " + bloodBank.getName(), "BLOOD_BANK", profile, token);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    private Map<String, Object> buildHospitalProfile(Hospital h) {
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", h.getId());
        profile.put("name", h.getName());
        profile.put("licenseNumber", h.getLicenseNumber());
        profile.put("email", h.getEmail());
        profile.put("phone", h.getPhone());
        profile.put("address", h.getAddress());
        profile.put("city", h.getCity());
        profile.put("type", h.getType());
        profile.put("verified", h.isVerified());
        profile.put("role", h.getRole().name());
        return profile;
    }
}
