package com.rbu.assessment.controller;

import com.rbu.assessment.dto.UpdateProfileRequest;
import com.rbu.assessment.dto.UserDto;
import com.rbu.assessment.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

// REST controller exposing user directory lookup and profile modifications
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String role) {
        List<UserDto> users = userService.searchUsers(query, role);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Principal principal) {
        UserDto updated = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(updated);
    }
}
