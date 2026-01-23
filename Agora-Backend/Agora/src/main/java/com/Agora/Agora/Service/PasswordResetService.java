package com.Agora.Agora.Service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.PasswordResetToken;
import com.Agora.Agora.Repository.PasswordResetTokenRepo;
import com.Agora.Agora.Repository.UserRepo;

// REMOVED: import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final EmailService emailService;
    private final PasswordResetTokenRepo resetRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public String sendResetOtp(String email) {
        AgoraUser user = userRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        PasswordResetToken token = resetRepo.findByEmail(email)
                .orElse(new PasswordResetToken());
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(expiry);
        resetRepo.save(token);

        try {
           // emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
        return "OTP sent to email";
    }

    public String verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        PasswordResetToken token = resetRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email"));

        if (!token.getOtp().equals(otp)) {
            return "Invalid OTP";
        }
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "OTP expired";
        }

        AgoraUser user = userRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        resetRepo.delete(token);

        return "Password reset successful";
    }
}