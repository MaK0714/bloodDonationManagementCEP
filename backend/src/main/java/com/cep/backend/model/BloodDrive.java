package com.cep.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a blood collection drive posted by a Blood Bank.
 * Pure in-memory Class-Object model — no external database.
 */
public class BloodDrive implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String bloodBankId;
    private String bloodBankName;
    private String city;
    private String location;     // specific venue
    private String reason;       // why the drive is being held
    private String period;       // e.g. "Oct 10–12, 9AM–5PM"
    private String contactPhone;
    private String status;       // "ACTIVE" | "COMPLETED"
    private List<String> registeredDonors = new ArrayList<>();
    private LocalDateTime createdAt;

    public BloodDrive() {
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
        this.registeredDonors = new ArrayList<>();
    }

    public BloodDrive(String id, String bloodBankId, String bloodBankName,
                      String city, String location, String reason,
                      String period, String contactPhone) {
        this.id = id;
        this.bloodBankId = bloodBankId;
        this.bloodBankName = bloodBankName;
        this.city = city;
        this.location = location;
        this.reason = reason;
        this.period = period;
        this.contactPhone = contactPhone;
        this.status = "ACTIVE";
        this.registeredDonors = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBloodBankId() { return bloodBankId; }
    public void setBloodBankId(String bloodBankId) { this.bloodBankId = bloodBankId; }

    public String getBloodBankName() { return bloodBankName; }
    public void setBloodBankName(String bloodBankName) { this.bloodBankName = bloodBankName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getRegisteredDonors() {
        if (registeredDonors == null) registeredDonors = new ArrayList<>();
        return registeredDonors;
    }
    public void setRegisteredDonors(List<String> registeredDonors) { this.registeredDonors = registeredDonors; }

    public int getRegisteredCount() {
        return registeredDonors != null ? registeredDonors.size() : 0;
    }

    public void addRegisteredDonor(String donorName) {
        if (this.registeredDonors == null) {
            this.registeredDonors = new ArrayList<>();
        }
        this.registeredDonors.add(donorName);
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
