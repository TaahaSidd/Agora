package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpLoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpRegistrationRequestDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Repository.UserRepo;
import com.Agora.Agora.Service.AuthService;
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
    private final PasswordResetService resetService;
    private final UserRepo userRepo;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login/otp")
    public ResponseEntity<LoginResponseDto> loginWithOtp(@Valid @RequestBody OtpLoginRequestDto req) {
        return ResponseEntity.ok(authService.loginWithOtp(req));
    }

    @PostMapping("/signup/otp")
    public ResponseEntity<LoginResponseDto> signupWithOtp(@Valid @RequestBody OtpLoginRequestDto req) {
        return ResponseEntity.ok(authService.signupWithOtp(req));
    }

    @PutMapping("/complete-profile")
    public ResponseEntity<LoginResponseDto> completeProfile(
            Principal principal,
            @Valid @RequestBody OtpRegistrationRequestDto req) {
        return ResponseEntity.ok(authService.completeProfile(principal.getName(), req));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto req) {
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