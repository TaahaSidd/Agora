package com.Agora.Agora.Dto.Response;

import lombok.Data;

@Data
public class GoogleTokenResponse {
    private String email;
    private Boolean email_verified;
    private String given_name;
    private String family_name;
    private String picture;
}
