package com.cep.backend.model;

public class LoginRequest {
    private String email;
    private String password;
    private String userType; // "USER" or "HOSPITAL"
    private String role;

    public LoginRequest() {}

    public LoginRequest(String email, String password, String userType) {
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUserType() {
        if (userType != null && !userType.trim().isEmpty()) return userType;
        if (role != null && !role.trim().isEmpty()) return role;
        return null;
    }
    public void setUserType(String userType) { this.userType = userType; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
