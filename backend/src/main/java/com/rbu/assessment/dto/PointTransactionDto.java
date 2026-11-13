package com.rbu.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

// DTO representing an individual point transaction in student history
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointTransactionDto {
    private UUID id;
    private Integer pointsDelta;
    private String reason;
    private String awardedByName;
    private Instant createdAt;
}
