package com.Agora.Agora.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.ExpoTokenReq;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/expo")
@RequiredArgsConstructor
public class ExpoController {

    private final UserRepo userRepo;

    @PostMapping("/save-token")
    public ResponseEntity<?> saveExpoToken(@RequestBody ExpoTokenReq req) {
        AgoraUser user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setExpoPushToken(req.getExpoToken());
        userRepo.save(user);

        return ResponseEntity.ok("Token saved");
    }
}
