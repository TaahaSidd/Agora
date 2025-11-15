package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.Follow;

public interface FollowRepo extends JpaRepository<Follow, Long> {

    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

    List<Follow> findByFollowerId(Long followerId);

    List<Follow> findByFollowingId(Long followingId);

    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
}
