package com.rbu.assessment.repository;

import com.rbu.assessment.entity.StudentProfile;
import com.rbu.assessment.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// Repository for querying student profiles and dynamic rankings
@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(UUID userId);

    @Query(value = "SELECT sp FROM StudentProfile sp JOIN FETCH sp.user u",
           countQuery = "SELECT count(sp) FROM StudentProfile sp")
    Page<StudentProfile> findAllWithUser(Pageable pageable);

    // Deterministic ranking computation: count students with higher points or prior timestamps
    @Query("SELECT COUNT(sp) + 1 FROM StudentProfile sp WHERE sp.totalPoints > :points " +
           "OR (sp.totalPoints = :points AND sp.id < :profileId)")
    long calculateRank(@Param("points") Integer points, @Param("profileId") UUID profileId);
}
