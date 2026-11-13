package com.rbu.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

// Entry representing an individual student's standings in the leaderboard
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardItemDto {
    private long rank;
    private UUID studentProfileId;
    private UUID userId;
    private String fullName;
    private String email;
    private String rollNumber;
    private String gradeLevel;
    private Integer totalPoints;
    private Instant lastPointsAwardedAt;
}
