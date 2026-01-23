package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Request.AuthRequestDto;
import com.Agora.Agora.Dto.Request.GoogleSignInRequest;
import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpRegistrationRequestDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Repository.UserRepo;
import com.Agora.Agora.Service.AuthService;
import com.Agora.Agora.Service.GoogleAuthService;
import com.Agora.Agora.Service.OtpService;
import com.Agora.Agora.Service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("Agora/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService  googleAuthService;
    private final PasswordResetService resetService;
    private final UserRepo userRepo;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/google-signin")
    public ResponseEntity<LoginResponseDto> googleSignIn(@Valid @RequestBody GoogleSignInRequest request) throws Exception {
        log.info("🔐 Google Sign-In request");
        return ResponseEntity.ok(googleAuthService.processGoogleSignIn(request));
    }

    @PutMapping("/complete-profile")
    public ResponseEntity<LoginResponseDto> completeProfile(
            @Valid @RequestBody OtpRegistrationRequestDto req) {
        return ResponseEntity.ok(authService.completeProfile(req.getUserEmail(), req));
    }

    @PostMapping("/signup")
    public ResponseEntity<LoginResponseDto> signup(@Valid @RequestBody AuthRequestDto req) {
        log.info("🚀 Signup request for: {}", req.getEmail());
        // This calls the new method we built in AuthService
        return ResponseEntity.ok(authService.signup(req));
    }

    // --- STEP 2: LOGIN (Standard Email/Pass) ---
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody AuthRequestDto req) {
        log.info("🔑 Login request for: {}", req.getEmail());
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return ResponseEntity.ok(resetService.sendResetOtp(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        String result = resetService.verifyOtpAndResetPassword(email, otp, newPassword);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkExists(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String mobileNumber) {
        boolean exists = false;

        if (email != null && !email.isEmpty()) {
            exists = userRepo.findByUserEmail(email).isPresent();
        }

        if (!exists && mobileNumber != null && !mobileNumber.isEmpty()) {
            exists = userRepo.findByMobileNumber(mobileNumber).isPresent();
        }

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }


}