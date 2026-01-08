package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpLoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpRegistrationRequestDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Jwt.JwtTokenProvider;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Model.RefreshToken;
import com.Agora.Agora.Repository.CollegeRepo;
import com.Agora.Agora.Repository.UserRepo;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final CollegeRepo collegeRepo;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final DtoMapper dto;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Transactional
    public LoginResponseDto loginOrSignupWithOtp(OtpLoginRequestDto req) {
        log.info("🔥 /auth/otp HIT! Payload: {}", req);
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(req.getFirebaseToken());
            String phoneNumber = (String) decodedToken.getClaims().get("phone_number");

            if (phoneNumber == null) {
                throw new RuntimeException("Invalid Firebase Token: no phone number found");
            }

            AgoraUser user = userRepo.findByMobileNumber(phoneNumber).orElse(null);

            if (user == null) {
                // NEW USER - Create with college & expo token
                log.info("New user signing up with phone: {}", phoneNumber);
                user = createNewUser(phoneNumber, req.getCollegeId(), req.getExpoPushToken());
            } else {
                // EXISTING USER - Update expo token if provided
                log.info("Existing user logging in: {}", phoneNumber);
                if (req.getExpoPushToken() != null && !req.getExpoPushToken().isEmpty()) {
                    user.setExpoPushToken(req.getExpoPushToken());
                    user = userRepo.save(user);
                }
            }

            String jwt = jwtTokenProvider.generateToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            return LoginResponseDto.builder()
                    .jwt(jwt)
                    .refreshToken(refreshToken.getToken())
                    .id(user.getId())
                    .userName(user.getUserName())
                    .mobileNumber(user.getMobileNumber())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .collegeId(user.getCollege() != null ? user.getCollege().getId().toString() : null)
                    .verificationStatus(user.getVerificationStatus())
                    .message(user.getVerificationStatus() == VerificationStatus.PENDING
                            ? "Please complete your profile to get verified"
                            : "Login successful!")
                    .build();

        } catch (Exception e) {
            log.error("OTP authentication failed", e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    private AgoraUser createNewUser(String phoneNumber, Long collegeId, String expoPushToken) {
        AgoraUser user = new AgoraUser();

        user.setMobileNumber(phoneNumber);

        String cleanPhone = phoneNumber.replaceAll("[+\\s-]", "");
        String last8Digits = cleanPhone.length() >= 8
                ? cleanPhone.substring(cleanPhone.length() - 8)
                : cleanPhone;
        user.setUserName("phone_" + last8Digits);

        user.setUserEmail(cleanPhone + "@agora.student");
        user.setFirstName("Student");
        user.setLastName("User");

        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setProfileImage("http://localhost:9000/images/placeholder.jpg");
        user.setRole(UserRole.STUDENT);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setVerificationStatus(VerificationStatus.PENDING);
        user.setCreatedAt(LocalDateTime.now());

        if (collegeId != null) {
            College college = collegeRepo.findById(collegeId)
                    .orElseThrow(() -> new RuntimeException("Invalid college selected"));
            user.setCollege(college);
            log.info("College set for new user: collegeId={}", collegeId);
        }

        if (expoPushToken != null && !expoPushToken.isEmpty()) {
            user.setExpoPushToken(expoPushToken);
            log.info("Expo push token set for new user");
        }

        return userRepo.save(user);
    }

    @Transactional
    public LoginResponseDto completeProfile(Long userId, OtpRegistrationRequestDto req) {
        AgoraUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new RuntimeException("Profile already completed");
        }

        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setUserName(generateUsername(req.getFirstName(), req.getLastName()));

        if (user.getCollege() == null && req.getCollege() != null && !req.getCollege().isEmpty()) {
            College college = collegeRepo.findByCollegeNameIgnoreCase(req.getCollege())
                    .orElseThrow(() -> new RuntimeException("Invalid college selected"));
            user.setCollege(college);
        }

        user.setVerificationStatus(VerificationStatus.VERIFIED);

        AgoraUser savedUser = userRepo.save(user);
        log.info("User profile completed and verified: userId={}", userId);

        String jwt = jwtTokenProvider.generateToken(savedUser);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);

        return LoginResponseDto.builder()
                .jwt(jwt)
                .refreshToken(refreshToken.getToken())
                .id(savedUser.getId())
                .userName(savedUser.getUserName())
                .mobileNumber(savedUser.getMobileNumber())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .collegeId(savedUser.getCollege() != null ? savedUser.getCollege().getId().toString() : null)
                .verificationStatus(savedUser.getVerificationStatus())
                .message("Profile completed! You can now create listings.")
                .build();
    }

    public LoginResponseDto login(LoginRequestDto req) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        AgoraUser user = userRepo.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String jwt = jwtTokenProvider.generateToken(user);
        RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);

        return LoginResponseDto.builder()
                .jwt(jwt)
                .refreshToken(refreshTokenEntity.getToken())
                .id(user.getId())
                .userName(user.getUsername())
                .userEmail(user.getUserEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mobileNumber(user.getMobileNumber())
                .verificationStatus(user.getVerificationStatus())
                .message("Login successful!")
                .build();
    }

    private String generateUsername(String firstName, String lastName) {
        String baseUsername = (firstName + lastName).toLowerCase().replaceAll("\\s+", "");
        String username = baseUsername;
        int counter = 1;

        while (userRepo.findByUserName(username).isPresent()) {
            username = baseUsername + counter++;
        }

        return username;
    }
}