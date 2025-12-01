package com.Agora.Agora.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
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

    // private void sendPushToUser(AgoraUser user, String title, String body) {
    // String expoToken = user.getExpoPushToken();

    // if (expoToken == null || expoToken.isEmpty())
    // return;

    // try {
    // HttpClient client = HttpClient.newHttpClient();
    // String json = String.format(
    // "[{\"to\":\"%s\",\"title\":\"%s\",\"body\":\"%s\"}]",
    // expoToken, title, body);

    // HttpRequest request = HttpRequest.newBuilder()
    // .uri(URI.create("https://exp.host/--/api/v2/push/send"))
    // .header("Accept", "application/json")
    // .header("Content-Type", "application/json")
    // .POST(HttpRequest.BodyPublishers.ofString(json))
    // .build();

    // client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    // .thenAccept(response -> System.out.println("Push response: " +
    // response.body()));

    // } catch (Exception e) {
    // System.out.println("Failed to send push: " + e.getMessage());
    // }
    // }

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

    @Scheduled(cron = "0 0 21 * * *")
    public void sendDailyUpdate() {
        String title = "Daily Update";
        String body = "Here is your daily update from Agora.";
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