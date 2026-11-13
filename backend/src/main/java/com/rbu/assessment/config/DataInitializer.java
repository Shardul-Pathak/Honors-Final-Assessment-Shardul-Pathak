package com.rbu.assessment.config;

import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import com.rbu.assessment.repository.StudentProfileRepository;
import com.rbu.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

// Seeds default demonstration accounts and leaderboard test records on startup
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial database users and student profiles...");

        // Seed 1 default teacher
        User teacher = User.builder()
                .fullName("Prof. Sarah Connor")
                .email("teacher@rbu.edu")
                .password(passwordEncoder.encode("Teacher123!"))
                .role(Role.TEACHER)
                .build();
        userRepository.save(teacher);

        // Seed default login student
        createStudent("Alex Mercer", "student@rbu.edu", "Student123!", "RBU-2026-001", "Computer Science", 380);

        // Seed 14 additional students for pagination and dynamic ranking tests
        List<StudentSeed> seedStudents = List.of(
                new StudentSeed("Emma Watson", "emma@rbu.edu", "RBU-2026-002", "Data Science", 520),
                new StudentSeed("Liam Davis", "liam@rbu.edu", "RBU-2026-003", "Computer Science", 495),
                new StudentSeed("Sophia Chen", "sophia@rbu.edu", "RBU-2026-004", "Artificial Intelligence", 480),
                new StudentSeed("Noah Wilson", "noah@rbu.edu", "RBU-2026-005", "Computer Science", 440),
                new StudentSeed("Olivia Taylor", "olivia@rbu.edu", "RBU-2026-006", "Cybersecurity", 425),
                new StudentSeed("Lucas Martin", "lucas@rbu.edu", "RBU-2026-007", "Data Science", 390),
                new StudentSeed("Ava Anderson", "ava@rbu.edu", "RBU-2026-008", "Artificial Intelligence", 365),
                new StudentSeed("Ethan Thomas", "ethan@rbu.edu", "RBU-2026-009", "Computer Science", 340),
                new StudentSeed("Mia Jackson", "mia@rbu.edu", "RBU-2026-010", "Cybersecurity", 310),
                new StudentSeed("James White", "james@rbu.edu", "RBU-2026-011", "Data Science", 280),
                new StudentSeed("Isabella Harris", "isabella@rbu.edu", "RBU-2026-012", "Computer Science", 250),
                new StudentSeed("Benjamin Clark", "benjamin@rbu.edu", "RBU-2026-013", "Artificial Intelligence", 220),
                new StudentSeed("Charlotte Lewis", "charlotte@rbu.edu", "RBU-2026-014", "Cybersecurity", 190),
                new StudentSeed("Daniel Robinson", "daniel@rbu.edu", "RBU-2026-015", "Computer Science", 160)
        );

        for (StudentSeed s : seedStudents) {
            createStudent(s.name, s.email, "Student123!", s.roll, s.dept, s.points);
        }

        log.info("Database seeding successfully completed with 1 Teacher and 15 Students.");
    }

    private void createStudent(String name, String email, String password, String roll, String dept, int points) {
        User user = User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.STUDENT)
                .build();
        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .rollNumber(roll)
                .gradeLevel(dept)
                .totalPoints(points)
                .lastPointsAwardedAt(Instant.now().minusSeconds(points * 60L))
                .build();
        studentProfileRepository.save(profile);
    }

    private record StudentSeed(String name, String email, String roll, String dept, int points) {}
}
