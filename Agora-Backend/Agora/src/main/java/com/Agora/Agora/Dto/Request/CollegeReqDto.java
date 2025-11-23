package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CollegeReqDto {

    @NotBlank(message = "College name cannot be blank")
    private String collegeName;

    @Email(message = "Invalid Email format")
    private String collegeEmail;

    @NotBlank(message = "Address cannot be Blank")
    private String address;

    @NotBlank(message = "City cannot be blank")
    private String city;

    @NotBlank(message = "State cannot be blank")
    private String state;

    @NotBlank(message = "Country cannot be blank")
    private String country;

    @Pattern(regexp = "^(https?://)?[\\w.-]+(\\.[\\w\\.-]+)+[/#?]?.*$", message = "Invalid website URL")
    private String website;

    private double latitude;
    private double longitude;
}
