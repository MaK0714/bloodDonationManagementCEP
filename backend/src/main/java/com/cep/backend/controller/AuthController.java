package com.cep.backend.controller;

import com.cep.backend.model.Hospital;
import com.cep.backend.model.LoginRequest;
import com.cep.backend.model.LoginResponse;
import com.cep.backend.model.RegisterRequest;
import com.cep.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** Unified Login Endpoint */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return response.isSuccess()
            ? ResponseEntity.ok(response)
            : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /** User / Donor Login */
    @PostMapping("/user/login")
    public ResponseEntity<LoginResponse> userLogin(@RequestBody LoginRequest request) {
        LoginResponse response = authService.loginUser(
            request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "",
            request.getPassword() != null ? request.getPassword().trim() : ""
        );
        return response.isSuccess()
            ? ResponseEntity.ok(response)
            : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /** Hospital Login */
    @PostMapping("/hospital/login")
    public ResponseEntity<LoginResponse> hospitalLogin(@RequestBody LoginRequest request) {
        LoginResponse response = authService.loginHospital(
            request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "",
            request.getPassword() != null ? request.getPassword().trim() : ""
        );
        return response.isSuccess()
            ? ResponseEntity.ok(response)
            : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /** Blood Bank Login */
    @PostMapping("/bloodbank/login")
    public ResponseEntity<LoginResponse> bloodBankLogin(@RequestBody LoginRequest request) {
        LoginResponse response = authService.loginBloodBank(
            request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "",
            request.getPassword() != null ? request.getPassword().trim() : ""
        );
        return response.isSuccess()
            ? ResponseEntity.ok(response)
            : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    /** User / Donor Registration */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> registerUser(@RequestBody RegisterRequest request) {
        LoginResponse response = authService.registerUser(request);
        return response.isSuccess()
            ? ResponseEntity.status(HttpStatus.CREATED).body(response)
            : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /** Hospital Registration */
    @PostMapping("/hospital/register")
    public ResponseEntity<LoginResponse> registerHospital(@RequestBody Hospital hospital) {
        LoginResponse response = authService.registerHospital(hospital);
        return response.isSuccess()
            ? ResponseEntity.status(HttpStatus.CREATED).body(response)
            : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /** Blood Bank Registration */
    @PostMapping("/bloodbank/register")
    public ResponseEntity<LoginResponse> registerBloodBank(@RequestBody Hospital bloodBank) {
        LoginResponse response = authService.registerBloodBank(bloodBank);
        return response.isSuccess()
            ? ResponseEntity.status(HttpStatus.CREATED).body(response)
            : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /** Demo accounts for quick testing */
    @GetMapping("/demo-accounts")
    public ResponseEntity<Map<String, Object>> getDemoAccounts() {
        Map<String, Object> demoData = new HashMap<>();

        Map<String, String> userDemo = new HashMap<>();
        userDemo.put("email", "donor@blood.org");
        userDemo.put("password", "donor123");
        userDemo.put("description", "Regular Blood Donor Account");

        Map<String, String> hospitalDemo = new HashMap<>();
        hospitalDemo.put("email", "hospital@care.org");
        hospitalDemo.put("password", "hosp123");
        hospitalDemo.put("description", "Verified Hospital Account");

        Map<String, String> bankDemo = new HashMap<>();
        bankDemo.put("email", "bank@bloodplus.org");
        bankDemo.put("password", "bank123");
        bankDemo.put("description", "BloodPlus Central Bank Account");

        demoData.put("user", userDemo);
        demoData.put("hospital", hospitalDemo);
        demoData.put("bloodBank", bankDemo);

        return ResponseEntity.ok(demoData);
    }
}
