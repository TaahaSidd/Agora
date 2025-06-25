package com.Agora.Agora.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.AgoraUser;

public interface UserRepo extends JpaRepository<AgoraUser, Long> {
    Optional<AgoraUser> findByUserEmail(String userEmail);

    Optional<AgoraUser> findByMobileNumber(String mobileNumber);

    Optional<AgoraUser> findByUserName(String userName);
}
