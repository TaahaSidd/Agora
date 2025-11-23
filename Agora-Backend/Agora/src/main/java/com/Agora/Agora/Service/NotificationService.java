package com.Agora.Agora.Service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Notification;
import com.Agora.Agora.Repository.NotificationRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final ExpoService expoService;

    public void sendListingLikedNotification(AgoraUser receiver, Listings listing, AgoraUser liker) {
        String title = "Someone liked your listing";
        String body = liker.getFirstName() + "liked" + listing.getTitle();

        Notification noti = new Notification();
        noti.setUser(receiver);
        noti.setTitle(title);
        noti.setBody(body);
        noti.setType("LISTING_LIKED");
        noti.setListings(listing);

        notificationRepo.save(noti);

        if (receiver.getExpoPushToken() != null) {
            expoService.sendNotification(receiver.getExpoPushToken(), title, body, new HashMap<>());
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
