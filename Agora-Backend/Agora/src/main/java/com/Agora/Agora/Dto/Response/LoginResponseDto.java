package com.Agora.Agora.Dto.Response;

import com.Agora.Agora.Model.Enums.VerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//This file is responsible for sending accessToken and refreshToken to the user.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    private String jwt;
    private String refreshToken;
    private Long id;
    private String userName;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String collegeId;
    private String collegeEmail;
    private String collegeName;
    private VerificationStatus verificationStatus;
    private String message;
}
