package com.Agora.Agora.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.Listings;

public interface ChatRoomRepo extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByListingAndBuyerAndSeller(Listings listing, AgoraUser buyer, AgoraUser seller);

    List<ChatRoom> findByBuyerOrSeller(AgoraUser buyer, AgoraUser seller); // to find all chats for a user.

}
