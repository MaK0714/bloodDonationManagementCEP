package com.cep.backend.repository;

import com.cep.backend.model.DonationEvent;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class DonationEventRepository {

    private final Map<String, DonationEvent> storage = new ConcurrentHashMap<>();

    public DonationEventRepository() {
        // Starts completely clean.
    }

    public DonationEvent save(DonationEvent event) {
        if (event.getId() == null || event.getId().trim().isEmpty()) {
            event.setId("EVT-" + System.currentTimeMillis());
        }
        storage.put(event.getId(), event);
        return event;
    }

    public Optional<DonationEvent> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<DonationEvent> findAll() {
        return new ArrayList<>(storage.values());
    }

    public int count() {
        return storage.size();
    }
}

