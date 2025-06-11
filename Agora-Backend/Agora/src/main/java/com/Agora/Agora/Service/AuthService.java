package com.Agora.Agora.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.RegistrationReqDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
import com.Agora.Agora.Jwt.JwtTokenProvider;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Model.RefreshToken;
import com.Agora.Agora.Model.User;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepo userRepo;
        private final JwtTokenProvider jwtTokenProvider;
        private final RefreshTokenService refreshTokenService;
        private final PasswordEncoder passwordEncoder;
        private final EmailService emailService;
        private final AuthenticationManager authenticationManager;
        // private final UserDetailsService userDetailsService;

        // Registering New Users.(Sign-Up).
        @Transactional
        public RegistrationResponseDto register(RegistrationReqDto req) {
                if (userRepo.findByUserEmail(req.getUserEmail()).isPresent()) { // Use isPresent() for Optional
                        throw new RuntimeException("Email already exists");
                }

                // building the new user.
                var user = User.builder()
                                .userName(req.getUserName())
                                .userEmail(req.getUserEmail())
                                .firstName(req.getFirstName())
                                .lastName(req.getLastName())
                                .mobileNumber(req.getMobileNumber())
                                .password(passwordEncoder.encode(req.getPassword()))
                                .collegeId(req.getCollegeId())
                                .collegeEmail(req.getCollegeEmail())
                                .collegeName(req.getCollegeName())
                                .role(UserRole.STUDENT)
                                .verificationStatus(VerificationStatus.PENDING_EMAIL)
                                .verificationToken(UUID.randomUUID().toString())
                                .tokenExpiryDate(LocalDateTime.now().plusHours(24))
                                .build();

                // save the user.
                var savedUser = userRepo.save(user);

                // Sending welcome email.
                String verificationLink = "http://localhost:8080/api/auth/verify-email?token="
                                + savedUser.getVerificationToken();
                emailService.sendWelcomeEmail(savedUser.getUserEmail(), savedUser.getUserName(), verificationLink);

                // prepare and return the registrationresponseDto
                return new RegistrationResponseDto(
                                savedUser.getId(),
                                savedUser.getUserName(),
                                savedUser.getUserEmail(),
                                savedUser.getFirstName(),
                                savedUser.getLastName(),
                                savedUser.getMobileNumber(),
                                savedUser.getCollegeId(),
                                savedUser.getCollegeEmail(),
                                savedUser.getCollegeName(),
                                savedUser.getVerificationStatus(), // Will be PENDING_EMAIL
                                "Registration successful! Please check your email to verify your account.");

        }

        // Login-in.
        public LoginResponseDto login(LoginRequestDto req) {
                Authentication authentication = authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(),
                                                req.getPassword()));

                UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                User user = userRepo.findByUserEmail(userDetails.getUsername()).get();

                // Generate the JWT (access token)
                String jwt = jwtTokenProvider.generateToken(userDetails);

                RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user);
                String refreshTokenString = refreshTokenEntity.getToken();

                return LoginResponseDto.builder()
                                .jwt(jwt)
                                .refreshToken(refreshTokenString)
                                .id(user.getId())
                                .userName(user.getUserName())
                                .userEmail(user.getUserEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .mobileNumber(user.getMobileNumber())
                                .collegeId(user.getCollegeId())
                                .collegeEmail(user.getCollegeEmail())
                                .collegeName(user.getCollegeName())
                                .verificationStatus(user.getVerificationStatus())
                                .message("Login successful!")
                                .build();
        }
}
