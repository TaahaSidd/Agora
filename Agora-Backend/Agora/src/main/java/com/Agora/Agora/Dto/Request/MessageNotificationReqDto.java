package com.Agora.Agora.Dto.Request;

import lombok.Data;

@Data
public class MessageNotificationReqDto {
    private Long receiverId;
    private String senderName;
    private String messageText;
    private String chatRoomId;
}
