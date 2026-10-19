package com.cep.backend.util;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Standard Java Object Serialization storage for Class-Object Repositories.
 * Serializes Java objects directly to disk without any third-party dependencies.
 * Ensures user registrations and hospital demands persist across server restarts.
 */
public class ObjectStorage {
    private static final String DATA_DIR = "data";

    @SuppressWarnings("unchecked")
    public static <T> Map<String, T> load(String filename) {
        Path path = Paths.get(DATA_DIR, filename);
        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return new ConcurrentHashMap<>();
        }
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path.toFile()))) {
            Object obj = ois.readObject();
            if (obj instanceof Map) {
                return new ConcurrentHashMap<>((Map<String, T>) obj);
            }
        } catch (Exception e) {
            System.err.println("[ObjectStorage] Notice: Starting fresh for " + filename + " (" + e.getMessage() + ")");
        }
        return new ConcurrentHashMap<>();
    }

    public static <T> void save(String filename, Map<String, T> data) {
        try {
            Path dir = Paths.get(DATA_DIR);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            Path path = Paths.get(DATA_DIR, filename);
            try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path.toFile()))) {
                oos.writeObject(new HashMap<>(data));
            }
        } catch (Exception e) {
            System.err.println("[ObjectStorage] Could not persist " + filename + ": " + e.getMessage());
        }
    }
}

