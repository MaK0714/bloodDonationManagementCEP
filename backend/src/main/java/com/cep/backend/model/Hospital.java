package com.cep.backend.model;

public class Hospital implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String name;
    private String licenseNumber;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String city;
    private Role role;
    private String type;       // "HOSPITAL" | "BLOOD_BANK"
    private boolean verified;  // admin-verified flag

    public Hospital() {
        this.role = Role.HOSPITAL;
        this.type = "HOSPITAL";
        this.verified = false;
    }

    public Hospital(String id, String name, String licenseNumber, String email,
                    String password, String phone, String address, String city) {
        this.id = id;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.role = Role.HOSPITAL;
        this.type = "HOSPITAL";
        this.verified = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
