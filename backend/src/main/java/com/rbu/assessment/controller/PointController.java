package com.rbu.assessment.controller;

import com.rbu.assessment.dto.AwardPointsRequest;
import com.rbu.assessment.dto.AwardPointsResponse;
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

// REST controller exposing teacher point allocation and student audit history
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
}
