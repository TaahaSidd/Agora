package com.Agora.Agora.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CollegeResponseDto {

    private Long id;

    private String collegeName;
    private String collegeEmail;
    private String address;
    private String city;
    private String state;
    private String country;
    private String website;

    private Double latitude;
    private Double longitude;
}
