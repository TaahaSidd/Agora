package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.ReportResolveReqDto;
import com.Agora.Agora.Dto.Response.ReportResolveResponse;
import com.Agora.Agora.Dto.Response.UserSummaryDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Enums.ItemStatus;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.ReportRepo;
import com.Agora.Agora.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final ReportRepo reportRepo;
    private final UserService userService;

    @Autowired
    @Lazy
    private  ListingService listingService;
    private final ListingsRepo listingsRepo;
    private final UserRepo userRepo;
    private final DtoMapper dto;
    private static final Logger log = LoggerFactory.getLogger(ModerationService.class);

    @Transactional
    public void banUser(Long userId) {
        AgoraUser user = userRepo.findById(userId).orElseThrow();
        user.setUserStatus(UserStatus.BANNED);
        userRepo.save(user);

        listingsRepo.deactivateAllBySellerId(userId, ItemStatus.DEACTIVATED);
    }

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
        if (Boolean.TRUE.equals(req.getActionOnListing()) && report.getListing() != null) {
            listingService.deleteListingCloudinary(report.getListing().getId());
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
    public void blockUser(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot block yourself");
        }

        AgoraUser currentUser = userRepo.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        AgoraUser targetUser = userRepo.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("Target user not found"));

        currentUser.getBlockedUsers().add(targetUser);

        targetUser.getBlockedByUsers().add(currentUser);

        userRepo.save(currentUser);
        userRepo.save(targetUser);
    }

    @Transactional
    public void unblockUser(Long currentUserId, Long targetUserId) {
        AgoraUser currentUser = userRepo.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        AgoraUser targetUser = userRepo.findById(targetUserId)
                .orElseThrow(() -> new EntityNotFoundException("Target user not found"));

        currentUser.getBlockedUsers().removeIf(u -> u.getId().equals(targetUserId));

        targetUser.getBlockedByUsers().removeIf(u -> u.getId().equals(currentUserId));

        userRepo.save(currentUser);
        userRepo.save(targetUser);
    }

//    @Transactional
//    public List<UserSummaryDto> getMyBlockedUsers(Long currentUserId) {
//        AgoraUser user = userRepo.findById(currentUserId)
//                .orElseThrow(() -> new EntityNotFoundException("User not found"));
//
//        return user.getBlockedUsers().stream()
//                .map(u -> new UserSummaryDto(
//                        u.getId(),
//                        u.getUserName(),
//                        u.getProfileImage()
//                ))
//                .collect(Collectors.toList());
//    }


    @Transactional
    public Map<String, List<UserSummaryDto>> getAllBlockedRelations(Long currentUserId) {
        AgoraUser user = userRepo.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<UserSummaryDto> usersIBlocked = user.getBlockedUsers().stream()
                .map(u -> new UserSummaryDto(u.getId(), u.getUserName(), u.getProfileImage()))
                .collect(Collectors.toList());

        List<UserSummaryDto> usersWhoBlockedMe = userRepo.findUsersWhoBlockedUser(currentUserId).stream()
                .map(u -> new UserSummaryDto(u.getId(), u.getUserName(), u.getProfileImage()))
                .collect(Collectors.toList());

        Map<String, List<UserSummaryDto>> result = new HashMap<>();
        result.put("blocked", usersIBlocked);
        result.put("blockedBy", usersWhoBlockedMe);

        return result;
    }

    public Set<Long> getAllRelatedBlockedIds(Long currentUserId) {
        AgoraUser user = userRepo.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Set<Long> ids = new HashSet<>();
        // People I blocked
        user.getBlockedUsers().forEach(u -> ids.add(u.getId()));
        // People who blocked me (The Double-Sided fix!)
        user.getBlockedByUsers().forEach(u -> ids.add(u.getId()));

        return ids;
    }

    public boolean canUsersInteract(Long userId1, Long userId2) {
        if (userId1.equals(userId2)) {
            return true;
        }

        boolean user1BlockedUser2 = userRepo.existsBlockRelation(userId1, userId2);
        boolean user2BlockedUser1 = userRepo.existsBlockRelation(userId2, userId1);

        return !user1BlockedUser2 && !user2BlockedUser1;
    }

    public boolean isBlockedBetween(Long currentUserId, Long targetUserId) {
        return !canUsersInteract(currentUserId, targetUserId);
    }
}
