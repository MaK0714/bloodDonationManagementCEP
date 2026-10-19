package com.cep.backend.service;

import com.cep.backend.model.BloodDrive;
import com.cep.backend.repository.BloodDriveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodDriveService {

    private final BloodDriveRepository driveRepository;

    public BloodDriveService(BloodDriveRepository driveRepository) {
        this.driveRepository = driveRepository;
    }

    public List<BloodDrive> getAllActive() {
        return driveRepository.findActive();
    }

    public List<BloodDrive> getAll() {
        return driveRepository.findAll();
    }

    public List<BloodDrive> getByCity(String city) {
        return driveRepository.findByCity(city);
    }

    public List<BloodDrive> filterDrives(String city, String search) {
        List<BloodDrive> list = (city != null && !city.trim().isEmpty() && !"ALL".equalsIgnoreCase(city))
                ? driveRepository.findByCity(city)
                : driveRepository.findActive();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            list = list.stream()
                .filter(d -> (d.getLocation() != null && d.getLocation().toLowerCase().contains(q)) ||
                             (d.getBloodBankName() != null && d.getBloodBankName().toLowerCase().contains(q)) ||
                             (d.getReason() != null && d.getReason().toLowerCase().contains(q)) ||
                             (d.getCity() != null && d.getCity().toLowerCase().contains(q)))
                .collect(Collectors.toList());
        }

        return list;
    }

    public List<BloodDrive> getByBloodBank(String bloodBankId) {
        return driveRepository.findByBloodBankId(bloodBankId);
    }

    public BloodDrive createDrive(BloodDrive drive) {
        return driveRepository.save(drive);
    }

    public boolean deleteDrive(String id) {
        return driveRepository.delete(id);
    }

    public Optional<BloodDrive> completeDrive(String id) {
        Optional<BloodDrive> opt = driveRepository.findById(id);
        if (opt.isPresent()) {
            BloodDrive drive = opt.get();
            drive.setStatus("COMPLETED");
            driveRepository.save(drive);
            return Optional.of(drive);
        }
        return Optional.empty();
    }

    public Optional<BloodDrive> registerDonor(String driveId, String donorName) {
        return driveRepository.registerDonor(driveId, donorName);
    }
}
