package com.Agora.Agora.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Response.NotificationResponseDto;
import com.Agora.Agora.Service.NotificationService;

import lombok.RequiredArgsConstructor;

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

    @PatchMapping("/read/{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Marked as read");
    }

    @DeleteMapping("/clear/{id}")
    public ResponseEntity<?> clearAll(@PathVariable Long id) {
        notificationService.clearAll(id);
        return ResponseEntity.noContent().build();
    }
}
