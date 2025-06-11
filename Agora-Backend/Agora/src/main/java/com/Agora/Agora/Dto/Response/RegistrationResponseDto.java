package com.Agora.Agora.Dto.Response;

import com.Agora.Agora.Model.Enums.VerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//this class is used to return the response of the user.
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponseDto {

    private Long id;

    // User Details.
    private String userName;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String mobileNumber;

    // College Id and Details.
    private String collegeId;
    private String collegeEmail;
    private String collegeName;

    private VerificationStatus verificationStatus;

    private String message;

}
