package com.Agora.Agora.Dto.Request;

import com.Agora.Agora.Model.Enums.MessageType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestDto {

    private Long chatRoomId;

    private String message;
    private MessageType messageType;
}
