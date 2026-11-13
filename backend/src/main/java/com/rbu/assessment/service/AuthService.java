package com.rbu.assessment.service;

import com.rbu.assessment.dto.*;
import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.exception.BadRequestException;
import com.rbu.assessment.exception.ResourceNotFoundException;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import com.rbu.assessment.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Service handling user registration, authentication, and profile mapping
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);

        StudentProfile profile = null;
        if (request.getRole() == Role.STUDENT) {
            profile = StudentProfile.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber() != null ? request.getRollNumber().trim() : null)
                    .gradeLevel(request.getGradeLevel() != null ? request.getGradeLevel().trim() : "Default")
                    .totalPoints(0)
                    .build();
            profile = studentProfileRepository.save(profile);
            user.setStudentProfile(profile);
        }

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDto(user, profile))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = null;
        if (user.getRole() == Role.STUDENT) {
            profile = studentProfileRepository.findByUser(user).orElse(null);
        }

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDto(user, profile))
                .build();
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = null;
        if (user.getRole() == Role.STUDENT) {
            profile = studentProfileRepository.findByUser(user).orElse(null);
        }

        return mapToUserDto(user, profile);
    }

    private UserDto mapToUserDto(User user, StudentProfile profile) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .studentProfileId(profile != null ? profile.getId() : null)
                .rollNumber(profile != null ? profile.getRollNumber() : null)
                .totalPoints(profile != null ? profile.getTotalPoints() : null)
                .gradeLevel(profile != null ? profile.getGradeLevel() : null)
                .build();
    }
}
