package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.Message;
import com.Agora.Agora.Model.AgoraUser;

public interface MessageRepo extends JpaRepository<Message, Long> {

    List<Message> findByChatRoomOrderBySentAtAsc(ChatRoom chatRoom);

    int countByChatRoomAndRecipientAndIsReadFalse(ChatRoom chatRoom, AgoraUser recipient);

    List<Message> findByChatRoom(ChatRoom chatRoom);
}
