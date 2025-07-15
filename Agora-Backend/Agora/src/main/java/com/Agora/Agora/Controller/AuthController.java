package com.Agora.Agora.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.LoginRequestDto;
import com.Agora.Agora.Dto.Request.RegistrationReqDto;
import com.Agora.Agora.Dto.Response.LoginResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
import com.Agora.Agora.Service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/auth/")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    // private final UserRepo userRepo;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> Register(@Valid @RequestBody RegistrationReqDto req) {
        // return ResponseEntity.ok(authService.register(req));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> Login(@Valid @RequestBody LoginRequestDto req) {
        return ResponseEntity.ok(authService.login(req));
    }

}
