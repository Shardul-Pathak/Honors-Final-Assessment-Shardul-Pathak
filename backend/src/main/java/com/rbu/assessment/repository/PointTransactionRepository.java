package com.rbu.assessment.repository;

import com.rbu.assessment.entity.PointTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

// Repository for querying point awarding transaction history
@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, UUID> {
    List<PointTransaction> findByStudentProfileIdOrderByCreatedAtDesc(UUID studentProfileId);
    Page<PointTransaction> findByStudentProfileIdOrderByCreatedAtDesc(UUID studentProfileId, Pageable pageable);
}
