package com.Agora.Agora.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.RefreshToken;
import com.Agora.Agora.Model.AgoraUser;
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

    /**
     * Creates and stores a new refresh token for a given user.
     * If the user already has a refresh token, the old one is replaced/updated.
     *
     * @param user The AppUser for whom to create the refresh token.
     * @return The created RefreshToken entity.
     */

    @Transactional
    public RefreshToken createRefreshToken(AgoraUser user) {
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepo.findByUser(user);

        RefreshToken refreshToken;
        if (existingTokenOpt.isPresent()) {
            // If an existing token found, update it (rotate token string and expiry)
            refreshToken = existingTokenOpt.get();
            refreshToken.setToken(UUID.randomUUID().toString()); // Generate a new token string
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

    /**
     * Verifies if a refresh token is valid and not expired.
     *
     * @param token The refresh token string.
     * @return An Optional containing the RefreshToken entity if valid, empty
     *         otherwise.
     */
    public Optional<RefreshToken> verifyRefreshToken(String token) {
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepo.findByToken(token);

        if (refreshTokenOpt.isEmpty()) {
            System.out.println("Refresh token not found: " + token);
            return Optional.empty(); // Token not found
        }

        RefreshToken refreshToken = refreshTokenOpt.get();

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            // Token has expired, delete it from the database
            refreshTokenRepo.delete(refreshToken);
            System.out.println("Refresh token expired and deleted: " + token);
            return Optional.empty(); // Token expired
        }

        return Optional.of(refreshToken); // Token is valid
    }

    /**
     * Deletes a refresh token from the database.
     *
     * @param token The refresh token string to delete.
     */
    @Transactional
    public void deleteRefreshToken(String token) {
        refreshTokenRepo.deleteByToken(token);
        System.out.println("Refresh token deleted from database: " + token);
    }

    /**
     * Deletes all refresh tokens associated with a specific user.
     * Useful for complete logout across all devices.
     *
     * @param user The AppUser whose refresh tokens should be deleted.
     */
    @Transactional
    public void deleteRefreshTokenByUser(AgoraUser user) {
        refreshTokenRepo.deleteByUser(user);
        System.out.println("All refresh tokens deleted for user: " + user.getUserEmail());
    }
}
