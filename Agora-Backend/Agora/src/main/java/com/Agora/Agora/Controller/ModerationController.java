package com.Agora.Agora.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.ReportResolveReqDto;
import com.Agora.Agora.Dto.Request.SystemNotificationRequest;
import com.Agora.Agora.Dto.Response.ReportResolveResponse;
import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Service.ListingService;
import com.Agora.Agora.Service.ModerationService;
import com.Agora.Agora.Service.NotificationService;
import com.Agora.Agora.Service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("Agora/Admin")
@RequiredArgsConstructor
public class ModerationController {

    private final ModerationService moderationService;
    private final NotificationService notifcationService;
    private final UserService userService;
    private final ListingService listingService;

    // 2. Resolve a report
    @PutMapping("/reports/{reportId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResolveResponse> resolveReport(
            @Valid @PathVariable Long reportId,
            @Valid @RequestBody ReportResolveReqDto resolveDTO) {
        ReportResolveResponse response = moderationService.resolveReport(reportId, resolveDTO);
        return ResponseEntity.ok(response);
    }

    // 3. Ban a user
    @PostMapping("/users/{userId}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> banUser(@Valid @PathVariable Long userId) {
        userService.banUser(userId);
        return ResponseEntity.ok().build();
    }

    // 4. Deactivate a listing
    @PostMapping("/listings/{listingId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateListing(@Valid @PathVariable Long listingId) {
        listingService.deactivateListing(listingId);
        return ResponseEntity.ok().build();
    }

    // 5. Get all reports
    @GetMapping("/get")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(moderationService.getAllReports());
    }

    // Notifications
    @PostMapping("/system")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendSystem(@RequestBody SystemNotificationRequest req) {
        notifcationService.sendSystemNotification(req.getTitle(), req.getBody());
        return ResponseEntity.ok("Sent to all users");
    }

}
