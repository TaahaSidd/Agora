package com.Agora.Agora.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Jwt.JwtTokenProvider;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.RefreshToken;
import com.Agora.Agora.Service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.Agora.Agora.Dto.Request.RefreshTokenReqDto;

@RestController
@RequestMapping("Agora/auth")
@RequiredArgsConstructor
public class RefreshTokenController {
    private final RefreshTokenService tokenService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenReqDto req) {
        String refreshTokenStr = req.getRefreshToken();
        if (refreshTokenStr == null) {
            return ResponseEntity.badRequest().body("Token is req");
        }

        Optional<RefreshToken> tokenOpt = tokenService.verifyRefreshToken(refreshTokenStr);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Invalid or expired token");
        }

        RefreshToken refreshToken = tokenOpt.get();
        AgoraUser user = refreshToken.getUser();

        String newJwt = tokenProvider.generateToken(user);

        RefreshToken updateRefreshToken = tokenService.createRefreshToken(user);

        return ResponseEntity.ok(Map.of(
                "jwt", newJwt,
                "refreshToken", updateRefreshToken.getToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");
        if (refreshToken != null) {
            tokenService.deleteRefreshToken(refreshToken);
        }
        return ResponseEntity.ok(Map.of("message", "logout successful"));
    }

}
