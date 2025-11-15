package com.Agora.Agora.Service;

import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Follow;
import com.Agora.Agora.Repository.FollowRepo;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepo followRepo;
    private final UserRepo userRepo;

    @Transactional
    public boolean follow(Long followerId, Long followingId) {

        if (followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false;
        }

        AgoraUser follower = userRepo.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        AgoraUser following = userRepo.findById(followingId)
                .orElseThrow(() -> new RuntimeException("Following not found"));

        followRepo.save(new Follow(follower, following));
        return true;
    }

    @Transactional
    public boolean unfollow(Long followerId, Long followingId) {
        if (!followRepo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return false;
        }
        followRepo.deleteByFollowerIdAndFollowingId(followerId, followingId);
        return true;
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepo.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public long getFollowersCount(Long userId) {
        return followRepo.findByFollowingId(userId).stream().count();
    }

    public long getFollowingCount(Long userId) {
        return followRepo.findByFollowerId(userId).stream().count();
    }
}
