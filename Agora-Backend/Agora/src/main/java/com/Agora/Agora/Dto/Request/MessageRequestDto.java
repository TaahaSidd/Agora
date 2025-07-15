package com.Agora.Agora.Dto.Request;

import com.Agora.Agora.Model.Enums.MessageType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Message cannot be empty")
    private String message;
    @NotNull(message = "Message Type is required ")
    private MessageType messageType;
}
