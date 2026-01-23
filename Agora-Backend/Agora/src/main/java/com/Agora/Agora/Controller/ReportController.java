package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Request.ReportReqDto;
import com.Agora.Agora.Dto.Response.ReportResponseDto;
import com.Agora.Agora.Dto.Response.UserSummaryDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.ModerationService;
import com.Agora.Agora.Service.ReportService;
import com.Agora.Agora.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Agora/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ModerationService moderationService;
    private final UserService userService;

    @PostMapping("/Make")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReportResponseDto> fileReport(@Valid @RequestBody ReportReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.filReport(req));
    }

    @GetMapping("/my-reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReportResponseDto>> getMyHistory() {
        return ResponseEntity.ok(reportService.getMyReportHistory());
    }

    @PostMapping("/block/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> blockUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal AgoraUser currentUser) {

        moderationService.blockUser(currentUser.getId(), userId);
        return ResponseEntity.ok("User blocked successfully");
    }

    @DeleteMapping("/unblock/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unblockUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal AgoraUser currentUser) {

        moderationService.unblockUser(currentUser.getId(), userId);
        return ResponseEntity.ok("User unblocked successfully");
    }

    @GetMapping("/blocked-list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, List<UserSummaryDto>>> getBlockedList(
            @AuthenticationPrincipal AgoraUser currentUser) {

        return ResponseEntity.ok(moderationService.getAllBlockedRelations(currentUser.getId()));
    }

    //    @PostMapping("/block/{userId}")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<String> blockUser(@PathVariable Long userId, Authentication auth) {
//        AgoraUser currentUser = (AgoraUser) auth.getPrincipal();
//        moderationService.blockUser(currentUser.getId(), userId);
//        return ResponseEntity.ok("User blocked successfully");
//    }


    //    @DeleteMapping("/unblock/{userId}")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<String> unblockUser(@PathVariable Long userId, Authentication auth) {
//        String mobileNumber = auth.getName();
//        AgoraUser currentUser = userService.findByMobileNumber(mobileNumber);
//
//        moderationService.unblockUser(currentUser.getId(), userId);
//        return ResponseEntity.ok("User unblocked successfully");
//    }

//    @GetMapping("/blocked-list")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<Map<String, List<UserSummaryDto>>> getBlockedList(Authentication auth) {
//        String mobileNumber = auth.getName();
//        AgoraUser currentUser = userService.findByMobileNumber(mobileNumber);
//
//        return ResponseEntity.ok(moderationService.getAllBlockedRelations(currentUser.getId()));
//    }

}
