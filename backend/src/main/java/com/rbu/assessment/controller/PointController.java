package com.rbu.assessment.controller;

import com.rbu.assessment.dto.AwardPointsRequest;
import com.rbu.assessment.dto.AwardPointsResponse;
import com.rbu.assessment.dto.OverviewStatsDto;
import com.rbu.assessment.dto.PointTransactionDto;
import com.rbu.assessment.service.PointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

// REST controller exposing teacher point allocation, student audit history, and class stats
@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @PostMapping("/award")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AwardPointsResponse> awardPoints(
            @Valid @RequestBody AwardPointsRequest request,
            Principal principal) {
        AwardPointsResponse response = pointService.awardPoints(request, principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<PointTransactionDto>> getStudentHistory(@PathVariable UUID studentId) {
        List<PointTransactionDto> history = pointService.getStudentHistory(studentId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<PointTransactionDto>> getMyHistory(Principal principal) {
        List<PointTransactionDto> history = pointService.getMyHistory(principal.getName());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PointTransactionDto>> getRecentTransactions(
            @RequestParam(defaultValue = "10") int limit) {
        List<PointTransactionDto> recent = pointService.getRecentTransactions(limit);
        return ResponseEntity.ok(recent);
    }

    @GetMapping("/stats")
    public ResponseEntity<OverviewStatsDto> getOverviewStats() {
        OverviewStatsDto stats = pointService.getOverviewStats();
        return ResponseEntity.ok(stats);
    }
}
