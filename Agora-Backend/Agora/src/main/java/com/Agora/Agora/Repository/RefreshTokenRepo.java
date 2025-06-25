package com.Agora.Agora.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.RefreshToken;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(AgoraUser user);

    void deleteByUser(AgoraUser user);

    void deleteByToken(String token);

}
