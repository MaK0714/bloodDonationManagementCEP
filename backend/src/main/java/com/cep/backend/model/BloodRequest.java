package com.cep.backend.model;

import java.time.LocalDateTime;

public class BloodRequest implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String hospitalId;
    private String hospitalName;
    private String bloodGroup; // e.g. "O+", "A-", "AB+", "B+"
    private int unitsNeeded;
    private int unitsFulfilled;
    private String urgency; // "CRITICAL", "HIGH", "NORMAL"
    private String city;
    private String contactPhone;
    private String patientName;
    private String diagnosis;
    private String note;
    private String status; // "ACTIVE", "FULFILLED"
    private LocalDateTime createdAt;

    public BloodRequest() {
        this.createdAt = LocalDateTime.now();
        this.unitsFulfilled = 0;
        this.status = "ACTIVE";
    }

    public BloodRequest(String id, String hospitalId, String hospitalName, String bloodGroup,
                        int unitsNeeded, String urgency, String city, String contactPhone, String note) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.hospitalName = hospitalName;
        this.bloodGroup = bloodGroup;
        this.unitsNeeded = unitsNeeded;
        this.unitsFulfilled = 0;
        this.urgency = urgency;
        this.city = city;
        this.contactPhone = contactPhone;
        this.note = note;
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public int getUnitsNeeded() { return unitsNeeded; }
    public void setUnitsNeeded(int unitsNeeded) { this.unitsNeeded = unitsNeeded; }

    public int getUnitsFulfilled() { return unitsFulfilled; }
    public void setUnitsFulfilled(int unitsFulfilled) {
        this.unitsFulfilled = unitsFulfilled;
        if (this.unitsFulfilled >= this.unitsNeeded) {
            this.status = "FULFILLED";
        }
    }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getNote() {
        if (note != null && !note.trim().isEmpty()) {
            return note;
        }
        if (diagnosis != null && !diagnosis.trim().isEmpty()) {
            return diagnosis;
        }
        return patientName;
    }
    public void setNote(String note) { this.note = note; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
