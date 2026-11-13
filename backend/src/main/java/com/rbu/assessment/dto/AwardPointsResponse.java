package com.rbu.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

// Response payload confirming successful point transaction and updated rank
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AwardPointsResponse {
    private UUID transactionId;
    private UUID studentProfileId;
    private String studentName;
    private Integer awardedPoints;
    private Integer newTotalPoints;
    private long newRank;
    private String awardedBy;
    private String reason;
    private Instant timestamp;
}
