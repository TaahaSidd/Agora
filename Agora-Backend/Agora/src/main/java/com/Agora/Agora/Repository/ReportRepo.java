package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Model.Enums.ReportStatus;

public interface ReportRepo extends JpaRepository<Report, Long> {

    List<Report> findByStatus(ReportStatus status);

    List<Report> findByReportedUserId(Long userId);

    List<Report> findByReportedListingId(Long listingId);
}
