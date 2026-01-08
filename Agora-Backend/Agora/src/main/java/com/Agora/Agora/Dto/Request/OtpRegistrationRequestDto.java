package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpRegistrationRequestDto {

    @NotBlank(message = "Firebase token is required")
    private String firebaseToken;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "College is required")
    private String college;

    private String expoPushToken;
}