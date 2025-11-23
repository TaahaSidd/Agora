package com.Agora.Agora.Service;

import java.time.Instant;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.ReportResolveReqDto;
import com.Agora.Agora.Dto.Response.ReportResolveResponse;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Enums.ItemStatus;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.ReportRepo;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final ReportRepo reportRepo;
    private final UserService userService;
    private final ListingService listingService;
    private final ListingsRepo listingsRepo;
    private final UserRepo userRepo;
    private final DtoMapper dto;

    @Transactional
    public List<Report> getAllReports() {
        AgoraUser admin = userService.getCurrentUser();

        if (!admin.isAdmin()) {
            throw new AccessDeniedException("Only admins can view all reports");
        }
        return reportRepo.findAll();
    }

    @Transactional
    public ReportResolveResponse resolveReport(Long reportId, ReportResolveReqDto req) {
        AgoraUser Admin = userService.getCurrentUser();
        if (!Admin.isAdmin()) {
            throw new AccessDeniedException("Only admins can resolve reports");
        }

        Report report = reportRepo.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("Report not found"));

        report.setStatus(req.getStatus());
        report.setModerationNotes(req.getModerationNotes());
        if (Boolean.TRUE.equals(req.getActionOnListing()) && report.getListings() != null) {
            listingService.deleteListingCloudinary(report.getListings().getId());
        }
        if (Boolean.TRUE.equals(req.getActionOnUser() && report.getReportedUser() != null)) {
            AgoraUser reportedUser = report.getReportedUser();
            reportedUser.setUserStatus(UserStatus.BANNED);
            userRepo.save(reportedUser);
        }
        report.setResolvedAt(Instant.now());
        Report updatedReport = reportRepo.save(report);
        return dto.mapToReportResolveResponse(updatedReport, req);
    }

    @Transactional
    public void deactivateListing(Long listingId) {
        Listings listing = listingsRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));
        listing.setItemStatus(ItemStatus.DEACTIVATED);
        listingsRepo.save(listing);
    }

    @Transactional
    public void banUser(Long userId) {
        AgoraUser user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setUserStatus(UserStatus.BANNED);
        userRepo.save(user);
    }
}
