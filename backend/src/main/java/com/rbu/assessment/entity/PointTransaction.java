package com.rbu.assessment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

// Audit log of all points awarded or adjusted by teachers
@Entity
@Table(name = "point_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "awarded_by_user_id", nullable = false)
    private User awardedBy;

    @Column(nullable = false)
    private Integer pointsDelta;

    @Column(nullable = false, length = 255)
    private String reason;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
