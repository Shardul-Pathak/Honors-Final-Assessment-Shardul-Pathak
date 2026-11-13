package com.rbu.assessment.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

// Request payload for a teacher to award or adjust student points
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AwardPointsRequest {

    @NotNull(message = "Student profile ID is required")
    private UUID studentProfileId;

    @NotNull(message = "Points value is required")
    @Min(value = -1000, message = "Points must be at least -1000")
    @Max(value = 1000, message = "Points must not exceed 1000")
    private Integer points;

    @NotBlank(message = "Reason for awarding points is required")
    private String reason;
}
