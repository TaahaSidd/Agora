package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.AuthRequestDto;
import com.Agora.Agora.Dto.Request.LoginRequestDto;
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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
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
    private final OtpService otpService;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

//    @Transactional
//    public LoginResponseDto loginWithOtp(OtpLoginRequestDto req) {
//        log.info("🔑 Login with OTP");
//        try {
//            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(req.getFirebaseToken());
//            String phoneNumber = (String) decodedToken.getClaims().get("phone_number");
//
//            if (phoneNumber == null) {
//                throw new RuntimeException("Invalid Firebase Token: no phone number found");
//            }
//
//            AgoraUser user = userRepo.findByMobileNumber(phoneNumber)
//                    .orElseThrow(() -> new RuntimeException("Account not found. Please sign up first."));
//
//            log.info("Existing user logging in: {}", phoneNumber);
//
//            if (req.getExpoPushToken() != null && !req.getExpoPushToken().isEmpty()) {
//                user.setExpoPushToken(req.getExpoPushToken());
//                user = userRepo.save(user);
//            }
//
//            String jwt = jwtTokenProvider.generateToken(user);
//            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
//
//            return LoginResponseDto.builder()
//                    .jwt(jwt)
//                    .refreshToken(refreshToken.getToken())
//                    .id(user.getId())
//                    .userName(user.getUserName())
//                    .mobileNumber(user.getMobileNumber())
//                    .firstName(user.getFirstName())
//                    .lastName(user.getLastName())
//                    .collegeId(user.getCollege() != null ? user.getCollege().getId().toString() : null)
//                    .verificationStatus(user.getVerificationStatus())
//                    .message(user.getVerificationStatus() == VerificationStatus.PENDING
//                            ? "Please complete your profile to get verified"
//                            : "Welcome back!")
//                    .build();
//
//        } catch (Exception e) {
//            log.error("Login failed", e);
//            throw new RuntimeException("Login failed: " + e.getMessage());
//        }
//    }
//
//    @Transactional
//    public LoginResponseDto loginWithOtp(OtpLoginRequestDto req) {
//        log.info("🔑 Login attempt for: {}", req.getEmail());
//
//        // 1. Verify the OTP using your OtpService
//        boolean isValid = otpService.verifyOtp(req.getEmail(), req.getOtp());
//        if (!isValid) {
//            throw new RuntimeException("Invalid or expired OTP");
//        }
//
//        // 2. Find the existing user
//        AgoraUser user = userRepo.findByUserEmail(req.getEmail())
//                .orElseThrow(() -> new RuntimeException("Account not found. Please sign up first."));
//
//        // 3. Generate new tokens
//        String jwt = jwtTokenProvider.generateToken(user);
//        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
//
//        return LoginResponseDto.builder()
//                .jwt(jwt)
//                .refreshToken(refreshToken.getToken())
//                .id(user.getId())
//                .userName(user.getUserName())
//                .userEmail(user.getUserEmail())
//                .mobileNumber(user.getMobileNumber())
//                .firstName(user.getFirstName())
//                .lastName(user.getLastName())
//                .collegeId(user.getCollege() != null ? user.getCollege().getId().toString() : null)
//                .verificationStatus(user.getVerificationStatus())
//                .message("Welcome back!")
//                .build();
//    }

    @Transactional
    public LoginResponseDto login(AuthRequestDto req) {
        log.info("🔑 Password Login attempt for: {}", req.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // 2. Get the User object from the authentication result
        AgoraUser user = (AgoraUser) authentication.getPrincipal();

        // 3. Update Expo Token if provided
        if (req.getExpoPushToken() != null) {
            user.setExpoPushToken(req.getExpoPushToken());
            userRepo.save(user);
        }

        // 4. Generate tokens
        String jwt = jwtTokenProvider.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return LoginResponseDto.builder()
                .jwt(jwt)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .userName(user.getUserName())
                .userEmail(user.getUserEmail())
                .verificationStatus(user.getVerificationStatus())
                .message("Login successful!")
                .build();
    }

    @Transactional
    public LoginResponseDto signup(AuthRequestDto req) {
        log.info("📝 Registering new user: {}", req.getEmail());
        try {
            // 1. Check if user already exists
            if (userRepo.findByUserEmail(req.getEmail()).isPresent()) {
                throw new RuntimeException("Account already exists with this email. Please login instead.");
            }

            // 2. Validate College
            if (req.getCollegeId() == null) {
                throw new RuntimeException("College selection is required for signup");
            }

            College college = collegeRepo.findById(req.getCollegeId())
                    .orElseThrow(() -> new RuntimeException("Invalid college selected"));

            // 3. Create User Entity
            AgoraUser user = new AgoraUser();
            user.setUserEmail(req.getEmail());
            user.setCollege(college);

            // Use the actual password from the Request DTO instead of a random UUID
            user.setPassword(passwordEncoder.encode(req.getPassword()));

            // Generate a temporary username from email
            String emailPrefix = req.getEmail().split("@")[0];
            user.setUserName(emailPrefix + "_" + new Random().nextInt(1000));

            // Set placeholders and defaults
            user.setProfileImage("https://your-production-url.com/images/placeHolder.png");
            user.setRole(UserRole.STUDENT);
            user.setUserStatus(UserStatus.ACTIVE);
            user.setVerificationStatus(VerificationStatus.PENDING); // Crucial for redirection in FD
            user.setCreatedAt(LocalDateTime.now());

            if (req.getExpoPushToken() != null && !req.getExpoPushToken().isEmpty()) {
                user.setExpoPushToken(req.getExpoPushToken());
            }

            // 4. Save to Database
            user = userRepo.save(user);

            String jwt = jwtTokenProvider.generateToken(user);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            log.info("✅ Signup successful for: {}", req.getEmail());

            return LoginResponseDto.builder()
                    .jwt(jwt)
                    .refreshToken(refreshToken.getToken())
                    .id(user.getId())
                    .userName(user.getUserName())
                    .userEmail(user.getUserEmail())
                    .collegeId(user.getCollege().getId().toString())
                    .verificationStatus(user.getVerificationStatus())
                    .message("Account created! Please complete your profile.")
                    .build();

        } catch (Exception e) {
            log.error("❌ Signup failed", e);
            throw new RuntimeException("Signup failed: " + e.getMessage());
        }
    }

    @Transactional
    public LoginResponseDto completeProfile(String email, OtpRegistrationRequestDto req) {
        // 1. SEARCH BY EMAIL (Not mobile number anymore)
        AgoraUser user = userRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new RuntimeException("Profile already completed");
        }

        // 2. SET THE NAMES
        user.setFirstName(req.getFirstName().trim());
        user.setLastName(req.getLastName().trim());

        // 3. SET THE PHONE NUMBER (Since it was null during signup)
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isEmpty()) {
            user.setMobileNumber(req.getPhoneNumber().trim());
        }

        // 4. UPDATE USERNAME (Optional: based on real names now)
        user.setUserName(generateUsername(req.getFirstName(), req.getLastName()));

        // 5. UPDATE TOKENS
        if (req.getExpoPushToken() != null && !req.getExpoPushToken().isEmpty()) {
            user.setExpoPushToken(req.getExpoPushToken());
        }

        // 6. FINALIZE STATUS
        user.setVerificationStatus(VerificationStatus.VERIFIED);

        AgoraUser savedUser = userRepo.save(user);
        log.info("User profile completed and verified: email={}", email);

        // 7. GENERATE NEW TOKENS (Standard practice after profile update)
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
                .userEmail(savedUser.getUserEmail())
                .collegeId(savedUser.getCollege() != null ? savedUser.getCollege().getId().toString() : null)
                .verificationStatus(savedUser.getVerificationStatus())
                .message("Profile completed! You can now create listings.")
                .build();
    }

//
//    @Transactional
//    public LoginResponseDto completeProfile(String phoneNumber, OtpRegistrationRequestDto req) {
//        AgoraUser user = userRepo.findByMobileNumber(phoneNumber)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (user.getVerificationStatus() == VerificationStatus.VERIFIED) {
//            throw new RuntimeException("Profile already completed");
//        }
//
//        user.setFirstName(req.getFirstName().trim());
//        user.setLastName(req.getLastName().trim());
//
//        if (req.getUserEmail() != null && !req.getUserEmail().isEmpty()) {
//            user.setUserEmail(req.getUserEmail().trim());
//        }
//
//        user.setUserName(generateUsername(req.getFirstName(), req.getLastName()));
//
////        // Update college if not set or changed
////        if (req.getCollege() != null && !req.getCollege().isEmpty()) {
////            College college = collegeRepo.findByCollegeNameIgnoreCase(req.getCollege())
////                    .orElseThrow(() -> new RuntimeException("Invalid college selected"));
////            user.setCollege(college);
////        }
//
//        if (req.getExpoPushToken() != null && !req.getExpoPushToken().isEmpty()) {
//            user.setExpoPushToken(req.getExpoPushToken());
//        }
//
//        user.setVerificationStatus(VerificationStatus.VERIFIED);
//
//        AgoraUser savedUser = userRepo.save(user);
//        log.info("User profile completed and verified: userId={}", phoneNumber);
//
//        String jwt = jwtTokenProvider.generateToken(savedUser);
//        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser);
//
//        return LoginResponseDto.builder()
//                .jwt(jwt)
//                .refreshToken(refreshToken.getToken())
//                .id(savedUser.getId())
//                .userName(savedUser.getUserName())
//                .mobileNumber(savedUser.getMobileNumber())
//                .firstName(savedUser.getFirstName())
//                .lastName(savedUser.getLastName())
//                .userEmail(savedUser.getUserEmail())
//                .collegeId(savedUser.getCollege() != null ? savedUser.getCollege().getId().toString() : null)
//                .verificationStatus(savedUser.getVerificationStatus())
//                .message("Profile completed! You can now create listings.")
//                .build();
//    }

//    public LoginResponseDto login(LoginRequestDto req) {
//        Authentication authentication = authenticationManager
//                .authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
//
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        AgoraUser user = userRepo.findByUserEmail(userDetails.getUsername())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        String jwt = jwtTokenProvider.generateToken(user);
//        RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);
//
//        return LoginResponseDto.builder()
//                .jwt(jwt)
//                .refreshToken(refreshTokenEntity.getToken())
//                .id(user.getId())
//                .userName(user.getUsername())
//                .userEmail(user.getUserEmail())
//                .firstName(user.getFirstName())
//                .lastName(user.getLastName())
//                .mobileNumber(user.getMobileNumber())
//                .verificationStatus(user.getVerificationStatus())
//                .message("Login successful!")
//                .build();
//    }


    public LoginResponseDto login(LoginRequestDto req) {
        // 1. Authenticate the user
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        // 2. The principal is your AgoraUser object.
        // Cast it directly so you don't need to call userRepo again.
        AgoraUser user = (AgoraUser) authentication.getPrincipal();

        // 3. Generate tokens
        String jwt = jwtTokenProvider.generateToken(user);
        RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);

        // 4. Build response using the 'user' object we already have
        return LoginResponseDto.builder()
                .jwt(jwt)
                .refreshToken(refreshTokenEntity.getToken())
                .id(user.getId())
                .userName(user.getUserName()) // Use your custom getter or variable
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