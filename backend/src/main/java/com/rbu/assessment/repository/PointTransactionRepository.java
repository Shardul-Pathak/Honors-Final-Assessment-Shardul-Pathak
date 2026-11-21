package com.rbu.assessment.repository;

import com.rbu.assessment.entity.PointTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

// Repository for querying point awarding transaction history
@Repository
public interface PointTransactionRepository extends JpaRepository<PointTransaction, UUID> {
    List<PointTransaction> findByStudentProfileIdOrderByCreatedAtDesc(UUID studentProfileId);
    Page<PointTransaction> findByStudentProfileIdOrderByCreatedAtDesc(UUID studentProfileId, Pageable pageable);

    @Query("SELECT pt FROM PointTransaction pt JOIN FETCH pt.studentProfile sp JOIN FETCH sp.user u JOIN FETCH pt.awardedBy ORDER BY pt.createdAt DESC")
    List<PointTransaction> findRecentWithDetails(Pageable pageable);

    @Query("SELECT COALESCE(SUM(pt.pointsDelta), 0) FROM PointTransaction pt")
    long sumAllPointsDelta();
}
