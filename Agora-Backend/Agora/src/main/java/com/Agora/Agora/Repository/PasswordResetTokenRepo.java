package com.Agora.Agora.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.PasswordResetToken;

public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByEmail(String email);
    Optional<PasswordResetToken> findByOtp(String otp);
}