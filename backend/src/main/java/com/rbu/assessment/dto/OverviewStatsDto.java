package com.rbu.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO representing class and system overview statistics
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverviewStatsDto {
    private long totalStudents;
    private long totalPointsDistributed;
    private int topScore;
    private int avgScore;
}
