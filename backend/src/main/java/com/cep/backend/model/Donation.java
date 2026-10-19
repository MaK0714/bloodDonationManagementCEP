package com.cep.backend.model;

import java.time.LocalDateTime;

/**
 * Represents a blood donation made by a donor to a registered hospital.
 * Pure in-memory Class-Object model — no external database.
 */
public class Donation implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String donorId;
    private String donorName;
    private String donorEmail;
    private String bloodGroup;
    private String hospitalId;
    private String hospitalName;
    private String city;
    private int units;
    private String status;      // "CONFIRMED" | "COMPLETED"
    private LocalDateTime donatedAt;

    public Donation() {
        this.status = "CONFIRMED";
        this.donatedAt = LocalDateTime.now();
        this.units = 1;
    }

    public Donation(String id, String donorId, String donorName, String donorEmail,
                    String bloodGroup, String hospitalId, String hospitalName,
                    String city, int units) {
        this.id = id;
        this.donorId = donorId;
        this.donorName = donorName;
        this.donorEmail = donorEmail;
        this.bloodGroup = bloodGroup;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.city = city;
        this.units = units > 0 ? units : 1;
        this.status = "CONFIRMED";
        this.donatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDonorId() { return donorId; }
    public void setDonorId(String donorId) { this.donorId = donorId; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDonatedAt() { return donatedAt; }
    public void setDonatedAt(LocalDateTime donatedAt) { this.donatedAt = donatedAt; }
}

