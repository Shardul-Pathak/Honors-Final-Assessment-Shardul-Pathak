package com.rbu.assessment.controller;

import com.rbu.assessment.dto.AuthResponse;
import com.rbu.assessment.dto.LoginRequest;
import com.rbu.assessment.dto.RegisterRequest;
import com.rbu.assessment.dto.UserDto;
import com.rbu.assessment.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

// REST controller exposing registration, login, and session endpoints
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Principal principal) {
        UserDto userDto = authService.getCurrentUser(principal.getName());
        return ResponseEntity.ok(userDto);
    }
}
