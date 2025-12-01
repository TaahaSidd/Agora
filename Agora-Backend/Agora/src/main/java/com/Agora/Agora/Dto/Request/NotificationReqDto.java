package com.Agora.Agora.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationReqDto {

    private Long userId;
    private Long listingsId;
    private String title;
    private String body;
    private String type;

}
