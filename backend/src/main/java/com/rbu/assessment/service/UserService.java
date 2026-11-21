package com.rbu.assessment.service;

import com.rbu.assessment.dto.UpdateProfileRequest;
import com.rbu.assessment.dto.UserDto;
import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.exception.ResourceNotFoundException;
import com.rbu.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// Service handling user directory discovery and profile management
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query, String roleStr) {
        Role role = null;
        if (roleStr != null && !roleStr.isBlank() && !"ALL".equalsIgnoreCase(roleStr)) {
            try {
                role = Role.valueOf(roleStr.toUpperCase().trim());
            } catch (IllegalArgumentException ignored) {}
        }

        String q = (query != null && !query.isBlank()) ? query.trim() : null;
        return userRepository.searchUsers(q, role).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        user.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        userRepository.save(user);

        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .studentProfileId(user.getStudentProfile() != null ? user.getStudentProfile().getId() : null)
                .rollNumber(user.getStudentProfile() != null ? user.getStudentProfile().getRollNumber() : null)
                .gradeLevel(user.getStudentProfile() != null ? user.getStudentProfile().getGradeLevel() : null)
                .totalPoints(user.getStudentProfile() != null ? user.getStudentProfile().getTotalPoints() : null)
                .phoneNumber(user.getPhoneNumber() != null ? user.getPhoneNumber() : "+91 98765 43210")
                .createdAt(user.getCreatedAt())
                .status("Active")
                .build();
    }
}
