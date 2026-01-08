package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpLoginRequestDto {

    @NotBlank(message = "Firebase token is required")
    private String firebaseToken;

    private Long collegeId;

    private String expoPushToken;
}