package com.rbu.assessment.dto;

import com.rbu.assessment.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

// Data transfer object representing the authenticated user's profile
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String fullName;
    private String email;
    private Role role;
    private UUID studentProfileId;
    private String rollNumber;
    private Integer totalPoints;
    private String gradeLevel;
    private String phoneNumber;
    private Instant createdAt;
    private String status;
}
