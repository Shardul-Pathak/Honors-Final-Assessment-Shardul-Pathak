package com.rbu.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

// Profile entity tracking points and rankings for student accounts
@Entity
@Table(name = "student_profiles", indexes = {
    @Index(name = "idx_student_points", columnList = "totalPoints, lastPointsAwardedAt, id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(length = 50)
    private String rollNumber;

    @Column(length = 50)
    private String gradeLevel;

    private Instant lastPointsAwardedAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
