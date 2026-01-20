package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationReqDto {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotBlank(message = "Username cannot be blank")
    private String userName;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    // private String mobileNumber;

    // @NotNull(message = "College id cannot be blank")
    // private Long collegeId;

}
