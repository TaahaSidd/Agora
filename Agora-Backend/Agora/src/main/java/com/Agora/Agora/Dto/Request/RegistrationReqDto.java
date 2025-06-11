package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//this class is used for registration request.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationReqDto {

    @NotBlank(message = "Username cannot be blank")
    private String userName;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @NotBlank(message = "Number cannot be blank")
    private String mobileNumber;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 20)
    // will use regex later.
    private String password;

    @NotBlank(message = "College id cannot be blank")
    private String collegeId;

    @NotBlank(message = "College email cannot be blank")
    @Email(message = "Invalid email format")
    private String collegeEmail;

    @NotBlank(message = "College name cannot be blank")
    private String collegeName;

}
