package com.cep.backend.repository;

import com.cep.backend.model.BloodDrive;
import com.cep.backend.util.ObjectStorage;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Class-Object Repository for BloodDrive data with persistent local storage.
 * Starts clean with 0 entries. Drives are persisted across server restarts.
 */
@Repository
public class BloodDriveRepository {
    private static final String STORAGE_FILE = "drives.dat";
    private final Map<String, BloodDrive> driveStorage;

    public BloodDriveRepository() {
        this.driveStorage = ObjectStorage.load(STORAGE_FILE);
    }

    public BloodDrive save(BloodDrive drive) {
        if (drive.getId() == null || drive.getId().trim().isEmpty()) {
            drive.setId("DRV-" + System.currentTimeMillis());
        }
        if (drive.getStatus() == null || drive.getStatus().trim().isEmpty()) {
            drive.setStatus("ACTIVE");
        }
        driveStorage.put(drive.getId(), drive);
        ObjectStorage.save(STORAGE_FILE, driveStorage);
        return drive;
    }

    public Optional<BloodDrive> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(driveStorage.get(id));
    }

    public List<BloodDrive> findAll() {
        return new ArrayList<>(driveStorage.values());
    }

    public List<BloodDrive> findActive() {
        return driveStorage.values().stream()
            .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()))
            .collect(Collectors.toList());
    }

    public List<BloodDrive> findByCity(String city) {
        if (city == null || city.trim().isEmpty() || "ALL".equalsIgnoreCase(city)) {
            return findActive();
        }
        return driveStorage.values().stream()
            .filter(d -> "ACTIVE".equalsIgnoreCase(d.getStatus()) && city.equalsIgnoreCase(d.getCity()))
            .collect(Collectors.toList());
    }

    public List<BloodDrive> findByBloodBankId(String bloodBankId) {
        if (bloodBankId == null) return new ArrayList<>();
        return driveStorage.values().stream()
            .filter(d -> bloodBankId.equalsIgnoreCase(d.getBloodBankId()))
            .collect(Collectors.toList());
    }

    public Optional<BloodDrive> registerDonor(String driveId, String donorName) {
        Optional<BloodDrive> opt = findById(driveId);
        if (opt.isPresent()) {
            BloodDrive drive = opt.get();
            drive.addRegisteredDonor(donorName != null ? donorName : "Registered Donor");
            driveStorage.put(drive.getId(), drive);
            ObjectStorage.save(STORAGE_FILE, driveStorage);
            return Optional.of(drive);
        }
        return Optional.empty();
    }

    public boolean delete(String id) {
        boolean removed = driveStorage.remove(id) != null;
        if (removed) {
            ObjectStorage.save(STORAGE_FILE, driveStorage);
        }
        return removed;
    }

    public int count() {
        return driveStorage.size();
    }
}
