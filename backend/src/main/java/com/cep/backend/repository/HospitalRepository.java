package com.cep.backend.repository;

import com.cep.backend.model.Hospital;
import com.cep.backend.util.ObjectStorage;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Class-Object Repository for Hospital and BloodBank data with persistent local storage.
 * Starts clean with 0 hardcoded entries. Only authentic registrations are stored.
 */
@Repository
public class HospitalRepository {
    private static final String STORAGE_FILE = "hospitals.dat";
    private final Map<String, Hospital> hospitalStorage;

    public HospitalRepository() {
        this.hospitalStorage = ObjectStorage.load(STORAGE_FILE);
    }

    public Optional<Hospital> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return Optional.ofNullable(hospitalStorage.get(email.toLowerCase().trim()));
    }

    public Optional<Hospital> findById(String id) {
        return hospitalStorage.values().stream()
            .filter(h -> h.getId().equals(id))
            .findFirst();
    }

    public Hospital save(Hospital hospital) {
        if (hospital.getId() == null || hospital.getId().trim().isEmpty()) {
            hospital.setId("HOSP-" + System.currentTimeMillis());
        }
        hospitalStorage.put(hospital.getEmail().toLowerCase().trim(), hospital);
        ObjectStorage.save(STORAGE_FILE, hospitalStorage);
        return hospital;
    }

    public List<Hospital> findAll() {
        return new ArrayList<>(hospitalStorage.values());
    }

    /** Returns only verified hospitals/bloodbanks in the given city (case-insensitive). */
    public List<Hospital> findByCity(String city) {
        if (city == null) return new ArrayList<>();
        return hospitalStorage.values().stream()
            .filter(h -> h.isVerified() && city.equalsIgnoreCase(h.getCity()))
            .collect(Collectors.toList());
    }

    /** Returns only verified entries of a given type: "HOSPITAL" or "BLOOD_BANK". */
    public List<Hospital> findByType(String type) {
        if (type == null) return new ArrayList<>();
        return hospitalStorage.values().stream()
            .filter(h -> h.isVerified() && type.equalsIgnoreCase(h.getType()))
            .collect(Collectors.toList());
    }

    /** Returns all verified entries (both hospitals and blood banks). */
    public List<Hospital> findAllVerified() {
        return hospitalStorage.values().stream()
            .filter(Hospital::isVerified)
            .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        if (email == null) return false;
        return hospitalStorage.containsKey(email.toLowerCase().trim());
    }

    public int count() {
        return hospitalStorage.size();
    }
}
