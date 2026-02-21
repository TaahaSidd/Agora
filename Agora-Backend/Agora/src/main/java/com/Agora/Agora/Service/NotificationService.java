package com.Agora.Agora.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Response.NotificationResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Notification;
import com.Agora.Agora.Repository.NotificationRepo;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;
    private final DtoMapper dto;

    private void sendPushToUser(AgoraUser user, String title, String body, String type, Long listingId) {
        String expoToken = user.getExpoPushToken();

        if (expoToken == null || expoToken.isEmpty())
            return;

        try {
            HttpClient client = HttpClient.newHttpClient();

            // Build customized JSON with more options
            StringBuilder jsonBuilder = new StringBuilder();
            jsonBuilder.append("[{")
                    .append("\"to\":\"").append(expoToken).append("\",")
                    .append("\"title\":\"").append(escapeJson(title)).append("\",")
                    .append("\"body\":\"").append(escapeJson(body)).append("\",")
                    .append("\"sound\":\"default\",") // Play notification sound
                    .append("\"badge\":1,") // Set badge count
                    .append("\"priority\":\"high\",") // High priority delivery
                    .append("\"channelId\":\"default\",") // Android notification channel
                    .append("\"data\":{") // Custom data payload
                    .append("\"type\":\"").append(type).append("\",")
                    .append("\"listingId\":").append(listingId != null ? listingId : "null").append(",")
                    .append("\"timestamp\":").append(System.currentTimeMillis())
                    .append("}")
                    .append("}]");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://exp.host/--/api/v2/push/send"))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBuilder.toString()))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> System.out.println("Push response: " + response.body()));

        } catch (Exception e) {
            System.out.println("Failed to send push: " + e.getMessage());
        }
    }

    @Transactional
    public void sendListingLikedNotification(AgoraUser receiver, Listings listing, AgoraUser liker) {
        String title = "Someone liked your listing";
        String body = liker.getFirstName() + " liked " + listing.getTitle();

        Notification noti = new Notification();
        noti.setUser(receiver);
        noti.setTitle(title);
        noti.setBody(body);
        noti.setType("LISTING_LIKED");
        noti.setListings(listing);
        noti.setRead(false);

        notificationRepo.save(noti);

        sendPushToUser(receiver, title, body, "LISTING_LIKED", listing.getId());
    }

    @Transactional
    public void createReviewNotification(AgoraUser reviewer, Listings listing) {
        AgoraUser owner = listing.getSeller();
        if (owner.getId().equals(reviewer.getId()))
            return;

        String title = "New Review";
        String body = reviewer.getFirstName() + " reviewed your listing '" + listing.getTitle() + "'";

        Notification notification = new Notification();
        notification.setUser(owner);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType("REVIEW");
        notification.setListings(listing);
        notification.setRead(false);

        notificationRepo.save(notification);

        sendPushToUser(owner, title, body, "REVIEW", listing.getId());
    }

    @Transactional
    public void createFollowNotification(AgoraUser follower, AgoraUser followed) {
        if (follower.getId().equals(followed.getId()))
            return;

        String title = "New Follower";
        String body = follower.getFirstName() + " started following you";

        Notification noti = new Notification();
        noti.setUser(followed);
        noti.setTitle(title);
        noti.setBody(body);
        noti.setType("FOLLOW");
        noti.setListings(null);
        noti.setRead(false);

        notificationRepo.save(noti);

        sendPushToUser(followed, title, body, "FOLLOW", null);
    }

    @Transactional
    public void sendSystemNotification(String title, String body) {
        List<AgoraUser> allUsers = userRepo.findAll();
        List<Notification> notifList = new ArrayList<>();

        for (AgoraUser user : allUsers) {
            Notification noti = new Notification();
            noti.setUser(user);
            noti.setTitle(title);
            noti.setBody(body);
            noti.setType("SYSTEM_UPDATE");
            noti.setListings(null);
            noti.setRead(false);
            notifList.add(noti);

            sendPushToUser(user, title, body, "SYSTEM_UPDATE", null);
        }

        notificationRepo.saveAll(notifList);
    }

    @Transactional
    public void createMessageNotification(Long receiverId, String senderName, String messageText, String chatRoomId) {
        AgoraUser receiver = userRepo.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String title = senderName;
        String body = messageText.length() > 100
                ? messageText.substring(0, 100) + "..."
                : messageText;

        // ✅ Create metadata JSON
        String metadata = String.format("{\"chatRoomId\":\"%s\",\"senderName\":\"%s\"}",
                chatRoomId, senderName.replace("\"", "\\\""));

        Notification notification = new Notification();
        notification.setUser(receiver);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setType("MESSAGE");
        notification.setListings(null);
        notification.setMetadata(metadata);
        notification.setRead(false);

        notificationRepo.save(notification);

        // Send push notification
        Map<String, Object> data = new HashMap<>();
        data.put("type", "MESSAGE");
        data.put("chatRoomId", chatRoomId);
        data.put("senderName", senderName);

        sendPushToUserWithData(receiver, title, body, data);
    }

    // Helper method to send push with custom data
    private void sendPushToUserWithData(AgoraUser user, String title, String body, Map<String, Object> data) {
        String expoToken = user.getExpoPushToken();
        if (expoToken == null || expoToken.isEmpty())
            return;

        try {
            HttpClient client = HttpClient.newHttpClient();

            // Build JSON with data payload
            StringBuilder jsonBuilder = new StringBuilder();
            jsonBuilder.append("[{")
                    .append("\"to\":\"").append(expoToken).append("\",")
                    .append("\"title\":\"").append(escapeJson(title)).append("\",")
                    .append("\"body\":\"").append(escapeJson(body)).append("\",")
                    .append("\"sound\":\"default\",")
                    .append("\"badge\":1,")
                    .append("\"priority\":\"high\",")
                    .append("\"channelId\":\"default\",")
                    .append("\"data\":{");

            // Add custom data
            boolean first = true;
            for (Map.Entry<String, Object> entry : data.entrySet()) {
                if (!first)
                    jsonBuilder.append(",");
                jsonBuilder.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof String) {
                    jsonBuilder.append("\"").append(escapeJson(entry.getValue().toString())).append("\"");
                } else {
                    jsonBuilder.append(entry.getValue());
                }
                first = false;
            }

            jsonBuilder.append(",\"timestamp\":").append(System.currentTimeMillis())
                    .append("}")
                    .append("}]");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://exp.host/--/api/v2/push/send"))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBuilder.toString()))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> System.out.println("Push response: " + response.body()));

        } catch (Exception e) {
            System.out.println("Failed to send push: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 21 * * MON,WED,FRI,SUN")
    public void sendDailyUpdate() {

        String[] messages = {
                "Check out what's new on campus today! 🎓",
                "Dorm spring cleaning? Turn your items into cash! 💰",
                "Safe Tip: Always meet in well-lit campus areas for exchanges. 🛡️",
                "Someone might be looking for what you have! Post a listing today. 🚀",
                "Browse latest deals from students at your college. 🎒"
        };

        String body = messages[new java.util.Random().nextInt(messages.length)];
        String title = "Agora Campus Update";

        sendSystemNotification(title, body);
    }

    public List<NotificationResponseDto> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(dto::mapToNotificationResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notiId) {
        Notification noti = notificationRepo.findById(notiId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        noti.setRead(true);
        notificationRepo.save(noti);
    }

    @Transactional
    public void markAllAsReadForUser(Long userId) {
        List<Notification> unreadNotifications = notificationRepo.findByUserIdAndReadFalse(userId);

        if (!unreadNotifications.isEmpty()) {
            unreadNotifications.forEach(noti -> noti.setRead(true));
            notificationRepo.saveAll(unreadNotifications);
        }
    }

    @Transactional
    public void clearAll(Long userId) {
        notificationRepo.deleteAllByUserId(userId);
    }

    private String escapeJson(String str) {
        if (str == null)
            return "";
        return str.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}