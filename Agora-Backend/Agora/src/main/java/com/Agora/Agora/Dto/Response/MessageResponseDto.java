package com.Agora.Agora.Dto.Response;

import java.time.Instant;

import com.Agora.Agora.Model.Enums.MessageType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {

    private Long id;
    private Long chatRoomId;
    private Long senderId;

    private String senderUserName;
    private String message;

    private Instant sendAt;
    private Boolean isRead;

    private MessageType messageType;
}
