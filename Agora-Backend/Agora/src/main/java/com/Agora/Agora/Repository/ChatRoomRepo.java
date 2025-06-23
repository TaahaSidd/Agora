package com.Agora.Agora.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.User;

public interface ChatRoomRepo extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByListingIdAndBuyerId(Listings listing, User buyer, User seller);

    List<ChatRoom> findByBuyerOrSeller(User buyer, User seller); // to find all chats for a user.

}
