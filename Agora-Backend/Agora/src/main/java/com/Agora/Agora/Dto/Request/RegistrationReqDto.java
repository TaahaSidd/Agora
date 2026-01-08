package com.Agora.Agora.Dto.Request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationReqDto {

    @NotBlank(message = "Phone number cannot be blank")
    private String phoneNumber;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 20)
    private String password;

    @NotBlank(message = "Id Card image is required")
    private MultipartFile idCardImage;

    // @NotBlank(message = "Username cannot be blank")
    // private String userName;

    // @NotBlank(message = "First name cannot be blank")
    // private String firstName;

    // @NotBlank(message = "Last name cannot be blank")
    // private String lastName;

    // @NotBlank(message = "Number cannot be blank")
    // private String mobileNumber;

    // @NotBlank(message = "Email cannot be blank")
    // @Email(message = "Invalid email format")
    // private String userEmail;

    // @NotBlank(message = "Id card number cannot be blank")
    // private String idCardNo;

    // @NotBlank(message = "Password cannot be blank")
    // @Size(min = 6, max = 20)
    // private String password;

    // @NotNull(message = "College id cannot be blank")
    // private Long collegeId;

    // private String profileImage;
}
