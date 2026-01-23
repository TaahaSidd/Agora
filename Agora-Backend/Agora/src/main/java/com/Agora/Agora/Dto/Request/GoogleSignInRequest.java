package com.Agora.Agora.Dto.Request;

import lombok.Data;

@Data
public class GoogleSignInRequest {
    private String idToken;
    private String expoPushToken;
}
