package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Request.MessageNotificationReqDto;
import com.Agora.Agora.Dto.Response.NotificationResponseDto;
import com.Agora.Agora.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Agora/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(@PathVariable Long userId) {
        List<NotificationResponseDto> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/message")
    public ResponseEntity<?> createMessageNotification(@RequestBody MessageNotificationReqDto request) {
        try {
            notificationService.createMessageNotification(
                    request.getReceiverId(),
                    request.getSenderName(),
                    request.getMessageText(),
                    request.getChatRoomId());
            return ResponseEntity.ok().body(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/read/{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Marked as read");
    }

    @PatchMapping("/mark-all-read/{userId}")
    public ResponseEntity<String> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsReadForUser(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    @DeleteMapping("/clear/{id}")
    public ResponseEntity<?> clearAll(@PathVariable Long id) {
        notificationService.clearAll(id);
        return ResponseEntity.noContent().build();
    }
}
