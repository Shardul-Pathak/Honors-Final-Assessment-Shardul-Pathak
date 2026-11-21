package com.rbu.assessment.service;

import com.rbu.assessment.dto.AwardPointsRequest;
import com.rbu.assessment.dto.AwardPointsResponse;
import com.rbu.assessment.dto.OverviewStatsDto;
import com.rbu.assessment.dto.PointTransactionDto;
import com.rbu.assessment.entity.PointTransaction;
import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.exception.BadRequestException;
import com.rbu.assessment.exception.ResourceNotFoundException;
import com.rbu.assessment.repository.PointTransactionRepository;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// Service coordinating atomic point distribution and audit logging
@Service
@RequiredArgsConstructor
public class PointService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final PointTransactionRepository pointTransactionRepository;

    @Transactional
    public AwardPointsResponse awardPoints(AwardPointsRequest request, String teacherEmail) {
        User teacher = userRepository.findByEmail(teacherEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher account not found: " + teacherEmail));

        if (teacher.getRole() != Role.TEACHER) {
            throw new BadRequestException("Only teachers are permitted to award or deduct points");
        }

        StudentProfile profile = studentProfileRepository.findById(request.getStudentProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found: " + request.getStudentProfileId()));

        PointTransaction transaction = PointTransaction.builder()
                .studentProfile(profile)
                .awardedBy(teacher)
                .pointsDelta(request.getPoints())
                .reason(request.getReason().trim())
                .build();

        pointTransactionRepository.save(transaction);

        int updatedTotal = (profile.getTotalPoints() != null ? profile.getTotalPoints() : 0) + request.getPoints();
        profile.setTotalPoints(updatedTotal);
        profile.setLastPointsAwardedAt(Instant.now());
        studentProfileRepository.save(profile);

        long newRank = studentProfileRepository.calculateRank(updatedTotal, profile.getId());

        return AwardPointsResponse.builder()
                .transactionId(transaction.getId())
                .studentProfileId(profile.getId())
                .studentName(profile.getUser().getFullName())
                .awardedPoints(request.getPoints())
                .newTotalPoints(updatedTotal)
                .newRank(newRank)
                .awardedBy(teacher.getFullName())
                .reason(request.getReason())
                .timestamp(transaction.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<PointTransactionDto> getStudentHistory(UUID studentProfileId) {
        return pointTransactionRepository.findByStudentProfileIdOrderByCreatedAtDesc(studentProfileId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PointTransactionDto> getMyHistory(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        return getStudentHistory(profile.getId());
    }

    @Transactional(readOnly = true)
    public List<PointTransactionDto> getRecentTransactions(int limit) {
        int boundedLimit = Math.min(50, Math.max(1, limit));
        return pointTransactionRepository.findRecentWithDetails(PageRequest.of(0, boundedLimit)).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OverviewStatsDto getOverviewStats() {
        long totalStudents = studentProfileRepository.count();
        long totalPointsDistributed = pointTransactionRepository.sumAllPointsDelta();
        int topScore = studentProfileRepository.findMaxPoints();
        int avgScore = (int) Math.round(studentProfileRepository.findAvgPoints());

        return OverviewStatsDto.builder()
                .totalStudents(totalStudents)
                .totalPointsDistributed(totalPointsDistributed)
                .topScore(topScore)
                .avgScore(avgScore)
                .build();
    }

    private PointTransactionDto mapToDto(PointTransaction tx) {
        return PointTransactionDto.builder()
                .id(tx.getId())
                .pointsDelta(tx.getPointsDelta())
                .reason(tx.getReason())
                .awardedByName(tx.getAwardedBy() != null ? tx.getAwardedBy().getFullName() : "Faculty")
                .studentName(tx.getStudentProfile() != null && tx.getStudentProfile().getUser() != null ? tx.getStudentProfile().getUser().getFullName() : "Student")
                .studentRollNumber(tx.getStudentProfile() != null ? tx.getStudentProfile().getRollNumber() : null)
                .studentProfileId(tx.getStudentProfile() != null ? tx.getStudentProfile().getId() : null)
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
