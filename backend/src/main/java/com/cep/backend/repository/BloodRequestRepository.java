package com.cep.backend.repository;

import com.cep.backend.model.BloodRequest;
import com.cep.backend.util.ObjectStorage;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Class-Object Repository for BloodRequest data with persistent local storage.
 * Starts clean with 0 entries. Demands are saved on creation and modification.
 */
@Repository
public class BloodRequestRepository {
    private static final String STORAGE_FILE = "requests.dat";
    private final Map<String, BloodRequest> storage;

    public BloodRequestRepository() {
        this.storage = ObjectStorage.load(STORAGE_FILE);
    }

    public BloodRequest save(BloodRequest request) {
        if (request.getId() == null || request.getId().trim().isEmpty()) {
            request.setId("REQ-" + System.currentTimeMillis());
        }
        storage.put(request.getId(), request);
        ObjectStorage.save(STORAGE_FILE, storage);
        return request;
    }

    public Optional<BloodRequest> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<BloodRequest> findAll() {
        return new ArrayList<>(storage.values());
    }

    public boolean delete(String id) {
        boolean removed = storage.remove(id) != null;
        if (removed) {
            ObjectStorage.save(STORAGE_FILE, storage);
        }
        return removed;
    }

    public int count() {
        return storage.size();
    }
}
