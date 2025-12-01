package com.Agora.Agora.Dto.Response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {
    private Long id;
    private Long userId;
    private Long listingsId;
    private String title;
    private String body;
    private String type;
    private Boolean read;
    private LocalDateTime createdAt;
}
