package com.Agora.Agora.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.OtpLoginRequestDto;
import com.Agora.Agora.Dto.Request.RegistrationReqDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
import com.Agora.Agora.Service.AuthService;
import com.Agora.Agora.Service.PasswordResetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService resetService;
    // private final UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> Register(@Valid @RequestBody RegistrationReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> Login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/login/otp")
    public ResponseEntity<LoginResponseDto> loginOtp(@RequestBody OtpLoginRequestDto req) {
        return ResponseEntity.ok(authService.loginOtp(req.getFirebaseToken()));
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
}
