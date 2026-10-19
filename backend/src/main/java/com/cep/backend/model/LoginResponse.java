package com.cep.backend.model;

public class LoginResponse {
    private boolean success;
    private String message;
    private String userType;
    private Object profile;
    private String token;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, String userType, Object profile, String token) {
        this.success = success;
        this.message = message;
        this.userType = userType;
        this.profile = profile;
        this.token = token;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Object getProfile() { return profile; }
    public void setProfile(Object profile) { this.profile = profile; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
