package com.Agora.Agora.Dto.Request;

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
public class UserReqDto {

    // User Details.
    private String userName;
    private String userEmail;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String password;
    private String idCardNo;
    private Long collegeId;

}
