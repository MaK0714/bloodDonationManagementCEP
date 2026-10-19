package com.cep.backend.repository;

import com.cep.backend.model.User;
import com.cep.backend.util.ObjectStorage;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Class-Object Repository for User / Donor data with persistent local storage.
 * Starts clean with 0 hardcoded entries. Only authentic registrations are stored.
 */
@Repository
public class UserRepository {
    private static final String STORAGE_FILE = "users.dat";
    private final Map<String, User> userStorage;

    public UserRepository() {
        this.userStorage = ObjectStorage.load(STORAGE_FILE);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return Optional.ofNullable(userStorage.get(email.toLowerCase().trim()));
    }

    public Optional<User> findById(String id) {
        return userStorage.values().stream()
            .filter(u -> u.getId().equals(id))
            .findFirst();
    }

    public User save(User user) {
        if (user.getId() == null || user.getId().trim().isEmpty()) {
            user.setId("USR-" + System.currentTimeMillis());
        }
        userStorage.put(user.getEmail().toLowerCase().trim(), user);
        ObjectStorage.save(STORAGE_FILE, userStorage);
        return user;
    }

    public List<User> findAll() {
        return new ArrayList<>(userStorage.values());
    }

    public boolean existsByEmail(String email) {
        if (email == null) return false;
        return userStorage.containsKey(email.toLowerCase().trim());
    }

    public int count() {
        return userStorage.size();
    }
}
