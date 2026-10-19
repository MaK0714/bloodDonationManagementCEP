package com.cep.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DonationEvent implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String title;
    private String organizerName;
    private String hospitalId;
    private String location;
    private String city;
    private String eventDate; // e.g. "Tomorrow, 9:00 AM - 4:00 PM"
    private int targetUnits;
    private List<String> registeredDonors; // list of donor names or ids
    private String status; // "UPCOMING", "COMPLETED"
    private LocalDateTime createdAt;

    public DonationEvent() {
        this.registeredDonors = new ArrayList<>();
        this.status = "UPCOMING";
        this.createdAt = LocalDateTime.now();
    }

    public DonationEvent(String id, String title, String organizerName, String hospitalId,
                         String location, String city, String eventDate, int targetUnits) {
        this.id = id;
        this.title = title;
        this.organizerName = organizerName;
        this.hospitalId = hospitalId;
        this.location = location;
        this.city = city;
        this.eventDate = eventDate;
        this.targetUnits = targetUnits;
        this.registeredDonors = new ArrayList<>();
        this.status = "UPCOMING";
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public int getTargetUnits() {
        return targetUnits;
    }

    public void setTargetUnits(int targetUnits) {
        this.targetUnits = targetUnits;
    }

    public List<String> getRegisteredDonors() {
        return registeredDonors;
    }

    public void setRegisteredDonors(List<String> registeredDonors) {
        this.registeredDonors = registeredDonors;
    }

    public void addDonor(String donor) {
        if (this.registeredDonors == null) {
            this.registeredDonors = new ArrayList<>();
        }
        if (!this.registeredDonors.contains(donor)) {
            this.registeredDonors.add(donor);
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

