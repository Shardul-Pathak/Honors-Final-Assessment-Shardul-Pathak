package com.rbu.assessment;

import com.rbu.assessment.dto.AwardPointsRequest;
import com.rbu.assessment.dto.AwardPointsResponse;
import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.repository.PointTransactionRepository;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import com.rbu.assessment.service.PointService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Unit tests for point awarding logic and ranking updates
@ExtendWith(MockitoExtension.class)
class PointServiceTest {

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PointTransactionRepository pointTransactionRepository;

    @InjectMocks
    private PointService pointService;

    private User teacher;
    private User studentUser;
    private StudentProfile studentProfile;
    private UUID profileId;

    @BeforeEach
    void setUp() {
        profileId = UUID.randomUUID();

        teacher = User.builder()
                .id(UUID.randomUUID())
                .fullName("Prof. Smith")
                .email("teacher@school.edu")
                .role(Role.TEACHER)
                .build();

        studentUser = User.builder()
                .id(UUID.randomUUID())
                .fullName("Alice")
                .email("alice@school.edu")
                .role(Role.STUDENT)
                .build();

        studentProfile = StudentProfile.builder()
                .id(profileId)
                .user(studentUser)
                .totalPoints(100)
                .rollNumber("RBU-001")
                .build();
    }

    @Test
    void testAwardPointsSuccess() {
        when(userRepository.findByEmail("teacher@school.edu")).thenReturn(Optional.of(teacher));
        when(studentProfileRepository.findById(profileId)).thenReturn(Optional.of(studentProfile));
        when(studentProfileRepository.calculateRank(125, profileId)).thenReturn(1L);

        AwardPointsRequest request = AwardPointsRequest.builder()
                .studentProfileId(profileId)
                .points(25)
                .reason("Quiz Winner")
                .build();

        AwardPointsResponse response = pointService.awardPoints(request, "teacher@school.edu");

        assertNotNull(response);
        assertEquals(125, response.getNewTotalPoints());
        assertEquals(25, response.getAwardedPoints());
        assertEquals(1L, response.getNewRank());
        verify(studentProfileRepository, times(1)).save(studentProfile);
        verify(pointTransactionRepository, times(1)).save(any());
    }
}
