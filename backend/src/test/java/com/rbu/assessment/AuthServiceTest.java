package com.rbu.assessment;

import com.rbu.assessment.dto.AuthResponse;
import com.rbu.assessment.dto.RegisterRequest;
import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.exception.BadRequestException;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import com.rbu.assessment.security.JwtTokenProvider;
import com.rbu.assessment.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Unit tests for registration and account validation logic
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterNewStudentSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("John Doe")
                .email("john@rbu.edu")
                .password("Password123!")
                .role(Role.STUDENT)
                .rollNumber("RBU-100")
                .gradeLevel("CS")
                .build();

        when(userRepository.existsByEmail("john@rbu.edu")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(tokenProvider.generateTokenFromEmail("john@rbu.edu")).thenReturn("dummy.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("dummy.jwt.token", response.getToken());
        assertEquals("john@rbu.edu", response.getUser().getEmail());
        assertEquals(Role.STUDENT, response.getUser().getRole());
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Jane Doe")
                .email("jane@rbu.edu")
                .password("Password123!")
                .role(Role.STUDENT)
                .build();

        when(userRepository.existsByEmail("jane@rbu.edu")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }
}
