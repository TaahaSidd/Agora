package com.Agora.Agora.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.RegistrationReqDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
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

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepo userRepo;
        private final CollegeRepo collegeRepo;
        private final JwtTokenProvider jwtTokenProvider;
        private final RefreshTokenService refreshTokenService;
        private final PasswordEncoder passwordEncoder;
        private final EmailService emailService;
        private final AuthenticationManager authenticationManager;
        private final DtoMapper dto;
        // private final UserDetailsService userDetailsService;

        @Transactional
        public RegistrationResponseDto register(RegistrationReqDto req) {
                if (userRepo.findByUserEmail(req.getUserEmail()).isPresent()) {
                        throw new RuntimeException("Email already exists");
                }

                if (userRepo.findByUserName(req.getUserName()).isPresent()) {
                        throw new IllegalArgumentException("Username already in use.");
                }
                College college = collegeRepo.findById(req.getCollegeId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "College not found with id: " + req.getCollegeId()));

                AgoraUser user = new AgoraUser();
                user.setUserName(req.getUserName());
                user.setUserEmail(req.getUserEmail());
                user.setFirstName(req.getFirstName());
                user.setLastName(req.getLastName());
                user.setMobileNumber(req.getMobileNumber());
                user.setPassword(passwordEncoder.encode(req.getPassword()));
                user.setIdCardNo(req.getIdCardNo());
                user.setCollege(college);
                user.setRole(UserRole.STUDENT);
                user.setUserStatus(UserStatus.ACTIVE);
                user.setVerificationStatus(VerificationStatus.PENDING_EMAIL);
                user.setVerificationToken(UUID.randomUUID().toString());
                user.setTokenExpiryDate(LocalDateTime.now().plusHours(24));

                AgoraUser savedUser = userRepo.save(user);

                String verificationLink = "http://localhost:8080/api/auth/verify-email?token="
                                + savedUser.getVerificationToken();
                emailService.sendWelcomeEmail(savedUser.getUserEmail(), savedUser.getUsername(),
                                verificationLink);

                String token = jwtTokenProvider.generateToken(savedUser);

                RegistrationResponseDto responseDto = dto.mapToRegistrationResponseDto(savedUser);
                responseDto.setToken(token);
                return responseDto;

        }

        // Login
        public LoginResponseDto login(LoginRequestDto req) {
                Authentication authentication = authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(),
                                                req.getPassword()));

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                AgoraUser user = userRepo.findByUserEmail(userDetails.getUsername()).get();
                String jwt = jwtTokenProvider.generateToken(user);

                RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);
                String refreshTokenString = refreshTokenEntity.getToken();

                return LoginResponseDto.builder()
                                .jwt(jwt)
                                .refreshToken(refreshTokenString)
                                .id(user.getId())
                                .userName(user.getUsername())
                                .userEmail(user.getUserEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .mobileNumber(user.getMobileNumber())
                                .idCardNo(user.getIdCardNo())
                                .verificationStatus(user.getVerificationStatus())
                                .message("Login successful!")
                                .build();
        }

        // Login with otp
        @SuppressWarnings("UseSpecificCatch")
        public LoginResponseDto loginOtp(String firebaseToken) {
                try {
                        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
                        String phoneNumber = (String) decodedToken.getClaims().get("phone_number");

                        if (phoneNumber == null) {
                                throw new RuntimeException("Invalid Firebase Token: no phone number found");
                        }

                        AgoraUser user = userRepo.findByMobileNumber(phoneNumber)
                                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                        String jwt = jwtTokenProvider.generateToken(user);
                        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

                        return LoginResponseDto.builder()
                                        .jwt(jwt)
                                        .refreshToken(refreshToken.getToken())
                                        .id(user.getId())
                                        .userName(user.getUserName())
                                        .mobileNumber(user.getMobileNumber())
                                        .message("OTP login successful!")
                                        .build();
                } catch (Exception e) {
                        throw new RuntimeException("FirebaseToken invalid");
                }
        }
}
