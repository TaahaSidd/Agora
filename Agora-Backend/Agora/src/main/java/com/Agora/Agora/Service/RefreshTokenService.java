package com.Agora.Agora.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.RefreshToken;
import com.Agora.Agora.Repository.RefreshTokenRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpirationMs;

    private final RefreshTokenRepo refreshTokenRepo;
    // private final UserRepository userRepo;

    @Transactional
    public RefreshToken createRefreshToken(AgoraUser user) {
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepo.findByUser(user);

        RefreshToken refreshToken;
        if (existingTokenOpt.isPresent()) {
            refreshToken = existingTokenOpt.get();
            refreshToken.setToken(UUID.randomUUID().toString());
            refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpirationMs));
        } else {
            refreshToken = RefreshToken.builder()
                    .user(user)
                    .token(UUID.randomUUID().toString())
                    .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                    .build();
        }
        refreshTokenRepo.save(refreshToken);
        return refreshToken;
    }

    @Transactional
    public Optional<RefreshToken> verifyRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepo.findByToken(token);

        if (refreshTokenOpt.isEmpty()) {
            System.out.println("Refresh token not found: " + token);
            return Optional.empty();
        }

        RefreshToken refreshToken = refreshTokenOpt.get();

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepo.delete(refreshToken);
            System.out.println("Refresh token expired and deleted: " + token);
            return Optional.empty();
        }

        return Optional.of(refreshToken);
    }

    @Transactional
    public void deleteRefreshToken(String token) {
        refreshTokenRepo.deleteByToken(token);
        System.out.println("Refresh token deleted from database: " + token);
    }

    @Transactional
    public void deleteRefreshTokenByUser(AgoraUser user) {
        refreshTokenRepo.deleteByUser(user);
        System.out.println("All refresh tokens deleted for user: " + user.getUserEmail());
    }
}
