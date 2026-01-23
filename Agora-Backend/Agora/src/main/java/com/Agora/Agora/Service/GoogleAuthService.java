package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.GoogleSignInRequest;
import com.Agora.Agora.Dto.Response.GoogleTokenResponse;;
import com.Agora.Agora.Dto.Response.GoogleUserInfo;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Jwt.JwtTokenProvider;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepo userRepo;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    private static final String GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    public GoogleUserInfo verifyGoogleToken(String idToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String url = GOOGLE_TOKEN_INFO_URL + idToken;

        try {
            GoogleTokenResponse response = restTemplate.getForObject(url, GoogleTokenResponse.class);

            if (response != null && response.getEmail_verified()) {
                return GoogleUserInfo.builder()
                        .email(response.getEmail())
                        .firstName(response.getGiven_name())
                        .lastName(response.getFamily_name())
                        .profilePicture(response.getPicture())
                        .build();
            }
            throw new RuntimeException("Invalid Google token");
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage());
        }
    }

    @Transactional
    public LoginResponseDto processGoogleSignIn(GoogleSignInRequest request) throws Exception {
        // 1. Verify Token
        GoogleUserInfo googleUser = verifyGoogleToken(request.getIdToken());

        // 2. Find or Create User
        AgoraUser user = userRepo.findByUserEmail(googleUser.getEmail())
                .map(existingUser -> updateExistingUser(existingUser, request.getExpoPushToken()))
                .orElseGet(() -> createNewGoogleUser(googleUser, request.getExpoPushToken()));

        // 3. Generate Auth Package
        String jwt = jwtTokenProvider.generateToken(user);
        String refresh = refreshTokenService.createRefreshToken(user).getToken();

        return mapToResponse(user, jwt, refresh);
    }

    private AgoraUser createNewGoogleUser(GoogleUserInfo googleUser, String pushToken) {
        AgoraUser user = new AgoraUser();
        user.setUserEmail(googleUser.getEmail());
        user.setFirstName(googleUser.getFirstName());
        user.setLastName(googleUser.getLastName());
        user.setUserName(generateUsername(googleUser.getFirstName(), googleUser.getLastName()));
        user.setProfileImage(googleUser.getProfilePicture());
        user.setExpoPushToken(pushToken);
        user.setVerificationStatus(VerificationStatus.PENDING);
        user.setRole(UserRole.STUDENT);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return userRepo.save(user);
    }

    private AgoraUser updateExistingUser(AgoraUser user, String pushToken) {
        if (pushToken != null) {
            user.setExpoPushToken(pushToken);
            return userRepo.save(user);
        }
        return user;
    }

    private LoginResponseDto mapToResponse(AgoraUser user, String jwt, String refresh) {
        return LoginResponseDto.builder()
                .jwt(jwt)
                .refreshToken(refresh)
                .id(user.getId())
                .userEmail(user.getUserEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userName(user.getUserName())
                .verificationStatus(user.getVerificationStatus())
                .message(user.getVerificationStatus() == VerificationStatus.PENDING ?
                        "Account created" : "Welcome back")
                .build();
    }

    private String generateUsername(String firstName, String lastName) {
        String safeLastName = (lastName != null && !lastName.isEmpty()) ? lastName : "";
        String baseUsername = (firstName + safeLastName).toLowerCase().replaceAll("\\s+", "");

        if (baseUsername.isEmpty()) {
            baseUsername = "user";
        }

        String username = baseUsername;
        int counter = 1;

        while (userRepo.existsByUserName(username)) {
            username = baseUsername + counter++;
        }
        return username;
    }
}


