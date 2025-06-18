package com.Agora.Agora.Dto.Response;

import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.VerificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long id;
    private String userName;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String idCardNo;

    private Long collegeId;
    private String collegeEmail;
    private String collegeName;

    private UserRole role;
    private VerificationStatus verificationStatus;

    private String message;
}
