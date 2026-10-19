package com.cep.backend.model;

public class User implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String name;
    private String email;
    private String password;
    private String bloodGroup;
    private String phone;
    private String city;
    private Role role;

    public User() {
        this.role = Role.USER;
    }

    public User(String id, String name, String email, String password, String bloodGroup, String phone, String city) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.city = city;
        this.role = Role.USER;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
