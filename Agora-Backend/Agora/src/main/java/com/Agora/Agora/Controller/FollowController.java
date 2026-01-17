package com.Agora.Agora.Controller;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.FollowService;
import com.Agora.Agora.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("Agora/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserService userService;

    @PostMapping("/follow/{followingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> followUser(@PathVariable Long followingId) {
        Long currentUserId = userService.getCurrentUser().getId();

        boolean success = followService.follow(currentUserId, followingId);
        if (!success) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/unfollow/{followingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unfollowUser(@PathVariable Long followingId) {
        Long currentUserId = userService.getCurrentUser().getId();

        boolean success = followService.unfollow(currentUserId, followingId);

        if (!success) {
            return ResponseEntity.badRequest().build();
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @GetMapping("/isFollowing/{userId}")
    public ResponseEntity<?> isFollowing(@PathVariable Long userId) {

        Long currentUserId = userService.getCurrentUser().getId();

        boolean status = followService.isFollowing(currentUserId, userId);

        return ResponseEntity.ok(status);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<?> getCounts(@PathVariable Long userId, Authentication authentication) {

        long followers = followService.getFollowersCount(userId);
        long following = followService.getFollowingCount(userId);

        boolean isFollowing = false;
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication.getPrincipal() instanceof String)) {

            AgoraUser currentUser = (AgoraUser) authentication.getPrincipal();
            isFollowing = followService.isFollowing(currentUser.getId(), userId);
        }

        return ResponseEntity.ok(
                new FollowCountResponse(followers, following, isFollowing));
    }

    record FollowCountResponse(long followers, long following, boolean isFollowing) {
    }

}
