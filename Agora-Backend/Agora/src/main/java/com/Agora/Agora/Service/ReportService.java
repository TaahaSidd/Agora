package com.Agora.Agora.Service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.ReportReqDto;
import com.Agora.Agora.Dto.Response.ReportResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Enums.ReportStatus;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.ReportRepo;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepo reportRepo;
    private final UserService userService;
    private final ListingsRepo listingsRepo;
    private final UserRepo userRepo;
    private final DtoMapper dto;

    @Transactional
    public ReportResponseDto filReport(ReportReqDto req) {
        AgoraUser currentUser = userService.getCurrentUser();

        if (req.getReportReason() == null) {
            throw new IllegalArgumentException("Report reason must not be blank.");
        }

        Report report = new Report();
        report.setReportType(req.getReportType());
        report.setReason(req.getReportReason());
        report.setReporter(currentUser);
        report.setStatus(ReportStatus.PENDING);
        report.setReportedAt(Instant.now());

        if (null == req.getReportType()) {
            throw new IllegalArgumentException("Unsupported report type.");
        } else // 3. Validate and set target
            switch (req.getReportType()) {
                case USER -> {
                    // Validate reported user exists
                    AgoraUser reportedUser = userRepo.findById(req.getReportedUserId())
                            .orElseThrow(() -> new EntityNotFoundException("Reported user not found"));
                    // Prevent self-reporting
                    if (reportedUser.getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("You cannot report yourself.");
                    }
                    report.setReportedUser(reportedUser);
                    report.setTargetId(reportedUser.getId());
                }
                case LISTING -> {
                    // Validate listing exists
                    Listings listing = listingsRepo.findById(req.getReportedListingId())
                            .orElseThrow(() -> new EntityNotFoundException("Listing not found"));
                    report.setListings(listing);
                    report.setTargetId(listing.getId());
                }
                case MESSAGE, CHAT_ROOM -> {
                    // Validate targetId is present
                    if (req.getTargetId() == null) {
                        throw new IllegalArgumentException("Target ID must be provided for this report type.");
                    }
                    report.setTargetId(req.getTargetId());
                    // Optionally: validate message/chat room exists
                }
                default -> throw new IllegalArgumentException("Unsupported report type.");
            }

        // 4. resolvedAt is null at creation (not resolved yet)
        report.setResolvedAt(null);

        // 5. Save report
        Report savedReport = reportRepo.save(report);

        // 6. Map to DTO and return
        return dto.mapToReportResponseDto(savedReport);

    }

    // Getting report by id - ADMIN ONLY.
    public ReportResponseDto getReportById(Long ReportId) {
        Report response = reportRepo.findById(ReportId).orElseThrow();

        return dto.mapToReportResponseDto(response);
    }

}
