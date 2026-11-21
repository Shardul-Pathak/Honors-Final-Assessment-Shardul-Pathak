package com.rbu.assessment.repository;

import com.rbu.assessment.entity.Role;
import com.rbu.assessment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// Repository for accessing user account records
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.studentProfile sp WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR (sp IS NOT NULL AND LOWER(sp.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')))) AND " +
           "(:role IS NULL OR u.role = :role) ORDER BY u.fullName ASC")
    List<User> searchUsers(@Param("query") String query, @Param("role") Role role);
}
