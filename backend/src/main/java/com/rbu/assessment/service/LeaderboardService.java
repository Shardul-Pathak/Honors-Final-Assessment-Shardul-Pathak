package com.rbu.assessment.service;

import com.rbu.assessment.dto.LeaderboardItemDto;
import com.rbu.assessment.dto.PagedResponse;
import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.exception.ResourceNotFoundException;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

// Service handling server-side paginated queries and deterministic leaderboard calculation
@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<LeaderboardItemDto> getLeaderboard(int page, int size, String sortBy, String direction) {
        int pageNumber = Math.max(0, page);
        int pageSize = Math.min(50, Math.max(1, size));

        Sort.Direction sortDir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = ("rollNumber".equalsIgnoreCase(sortBy) || "createdAt".equalsIgnoreCase(sortBy))
                ? sortBy : "totalPoints";

        // Deterministic sorting with composite tie-breakers
        Sort sort = Sort.by(
                new Sort.Order(sortDir, property),
                new Sort.Order(Sort.Direction.ASC, "id")
        );

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<StudentProfile> profilePage = studentProfileRepository.findAllWithUser(pageable);

        List<LeaderboardItemDto> items = new ArrayList<>();
        long startingRank = (long) pageNumber * pageSize + 1;

        for (int i = 0; i < profilePage.getContent().size(); i++) {
            StudentProfile profile = profilePage.getContent().get(i);
            items.add(mapToDto(profile, startingRank + i));
        }

        return PagedResponse.<LeaderboardItemDto>builder()
                .content(items)
                .pageNumber(profilePage.getNumber())
                .pageSize(profilePage.getSize())
                .totalElements(profilePage.getTotalElements())
                .totalPages(profilePage.getTotalPages())
                .isFirst(profilePage.isFirst())
                .isLast(profilePage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public LeaderboardItemDto getStudentRank(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        long rank = studentProfileRepository.calculateRank(profile.getTotalPoints(), profile.getId());
        return mapToDto(profile, rank);
    }

    private LeaderboardItemDto mapToDto(StudentProfile profile, long rank) {
        return LeaderboardItemDto.builder()
                .rank(rank)
                .studentProfileId(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .rollNumber(profile.getRollNumber())
                .gradeLevel(profile.getGradeLevel())
                .totalPoints(profile.getTotalPoints())
                .lastPointsAwardedAt(profile.getLastPointsAwardedAt())
                .build();
    }
}
