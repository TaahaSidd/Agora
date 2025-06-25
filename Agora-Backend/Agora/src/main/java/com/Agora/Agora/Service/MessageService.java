package com.Agora.Agora.Service;

import org.springframework.stereotype.Service;

import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Repository.MessageRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepo messageRepo;

    public int UnreadMessageCounter(ChatRoom chatRoom, AgoraUser currentUser) {
        return messageRepo.countByChatRoomAndRecipientAndIsReadFalse(chatRoom, currentUser);
    }

}
