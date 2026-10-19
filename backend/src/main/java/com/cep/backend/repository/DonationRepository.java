package com.cep.backend.repository;

import com.cep.backend.model.Donation;
import com.cep.backend.util.ObjectStorage;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Class-Object Repository for Blood Donations with persistent local storage.
 * Starts completely clean. All donations are recorded strictly through the portal.
 */
@Repository
public class DonationRepository {
    private static final String STORAGE_FILE = "donations.dat";
    private final Map<String, Donation> donationStorage;

    public DonationRepository() {
        this.donationStorage = ObjectStorage.load(STORAGE_FILE);
    }

    public Donation save(Donation donation) {
        if (donation.getId() == null || donation.getId().trim().isEmpty()) {
            donation.setId("DON-" + System.currentTimeMillis());
        }
        donationStorage.put(donation.getId(), donation);
        ObjectStorage.save(STORAGE_FILE, donationStorage);
        return donation;
    }

    public Optional<Donation> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(donationStorage.get(id));
    }

    public List<Donation> findAll() {
        return new ArrayList<>(donationStorage.values());
    }

    public List<Donation> findByDonorId(String donorId) {
        if (donorId == null) return new ArrayList<>();
        return donationStorage.values().stream()
                .filter(d -> donorId.equalsIgnoreCase(d.getDonorId()) || donorId.equalsIgnoreCase(d.getDonorEmail()))
                .collect(Collectors.toList());
    }

    public List<Donation> findByHospitalId(String hospitalId) {
        if (hospitalId == null) return new ArrayList<>();
        return donationStorage.values().stream()
                .filter(d -> hospitalId.equalsIgnoreCase(d.getHospitalId()))
                .collect(Collectors.toList());
    }

    public int count() {
        return donationStorage.size();
    }
}
