package com.cep.backend.service;

import com.cep.backend.model.DonationEvent;
import com.cep.backend.repository.DonationEventRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonationEventService {

    private final DonationEventRepository donationEventRepository;

    public DonationEventService(DonationEventRepository donationEventRepository) {
        this.donationEventRepository = donationEventRepository;
    }

    public List<DonationEvent> getAllEvents() {
        return donationEventRepository.findAll().stream()
                .sorted(Comparator.comparing(DonationEvent::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<DonationEvent> getEventById(String id) {
        return donationEventRepository.findById(id);
    }

    public DonationEvent createEvent(DonationEvent event) {
        return donationEventRepository.save(event);
    }

    public Optional<DonationEvent> registerDonor(String eventId, String donorName) {
        Optional<DonationEvent> opt = donationEventRepository.findById(eventId);
        if (opt.isPresent()) {
            DonationEvent event = opt.get();
            event.addDonor(donorName);
            donationEventRepository.save(event);
            return Optional.of(event);
        }
        return Optional.empty();
    }
}

