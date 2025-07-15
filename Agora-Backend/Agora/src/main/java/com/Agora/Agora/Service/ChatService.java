package com.Agora.Agora.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.MessageRequestDto;
import com.Agora.Agora.Dto.Request.OfferReqDto;
import com.Agora.Agora.Dto.Response.ChatRoomResponseDto;
import com.Agora.Agora.Dto.Response.MessageResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.Enums.MessageType;
import com.Agora.Agora.Model.Enums.OfferAction;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Message;
import com.Agora.Agora.Repository.ChatRoomRepo;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.MessageRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepo chatRoomRepo;
    private final MessageRepo messageRepo;
    private final ListingsRepo listingsRepo;
    private final UserService userService;
    private final DtoMapper dto;

    // Checking existing room if not present creating a new one.
    @Transactional
    public ChatRoomResponseDto getOrCreateChatRoom(Long listingId) {
        AgoraUser currentUser = userService.getCurrentUser();

        Listings listing = listingsRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Listings not found"));

        AgoraUser seller = listing.getSeller();

        // Prevent seller from chatting with themselves.
        if (seller.getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Seller cannot start their chat on their listings");
        }

        Optional<ChatRoom> existingChatRoom = chatRoomRepo.findByListingAndBuyerAndSeller(listing, currentUser, seller);

        ChatRoom chatRoom;

        if (existingChatRoom.isPresent()) {
            chatRoom = existingChatRoom.get();// existing chat room.
        } else {
            chatRoom = new ChatRoom();
            chatRoom.setListing(listing);
            chatRoom.setBuyer(currentUser);
            chatRoom.setSeller(seller);
            chatRoom.setCreatedAt(Instant.now());
            chatRoom.setLastMessageAt(Instant.now());

            chatRoom = chatRoomRepo.save(chatRoom);
        }
        ChatRoomResponseDto responseDto = dto.mapToChatRoomResponseDto(chatRoom, currentUser);
        return responseDto;
    }

    // Sending message.
    @Transactional
    public MessageResponseDto sendMessage(MessageRequestDto req) {
        // Find current User.
        AgoraUser sender = userService.getCurrentUser();

        // Find chatroom.
        ChatRoom chatRoom = chatRoomRepo.findById(req.getChatRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        // Validate sender is a participant
        if (!chatRoom.getBuyer().getId().equals(sender.getId())
                && !chatRoom.getSeller().getId().equals(sender.getId())) {
            throw new AccessDeniedException("You are not a participant of this chat room");
        }

        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setMessage(req.getMessage());
        message.setSentAt(Instant.now());
        message.setIsRead(false);
        message.setMessageType(req.getMessageType());

        // Updating last message.
        chatRoom.setLastMessageAt(message.getSentAt());
        chatRoomRepo.save(chatRoom);

        Message savedMessage = messageRepo.save(message);

        MessageResponseDto responseDto = dto.mapToMessageResponseDto(savedMessage);
        return responseDto;
    }

    // make getMessagesInChatRoom(Long chatRoomId).
    public List<MessageResponseDto> getMessagesInChatRoom(Long chatRoomId) {
        // Get current User.
        AgoraUser currentUser = userService.getCurrentUser();

        ChatRoom chatRoom = chatRoomRepo.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        if (!chatRoom.getBuyer().getId().equals(currentUser.getId())
                && !chatRoom.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not a participant of this chat room");
        }

        List<Message> message = messageRepo.findByChatRoom(chatRoom);

        return message.stream()
                .map(dto::mapToMessageResponseDto)
                .collect(Collectors.toList());

    }

    // Get user ChatRoom.
    public List<ChatRoomResponseDto> getUserChatRooms() {
        AgoraUser user = userService.getCurrentUser();

        List<ChatRoom> chatRooms = chatRoomRepo.findByBuyerOrSeller(user, user);

        return chatRooms.stream()
                .map(chatRoom -> dto.mapToChatRoomResponseDto(chatRoom, user))
                .collect(Collectors.toList());

    }

    // Make offer.
    @Transactional
    public MessageResponseDto makeOffer(OfferReqDto req) {
        AgoraUser sender = userService.getCurrentUser();

        // Fetch chatroom.
        ChatRoom chatRoom = chatRoomRepo.findById(req.getChatRoomId())
                .orElseThrow(() -> new EntityNotFoundException("ChatRoom not found"));

        // Validating buyer.
        if (!chatRoom.getBuyer().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Only buyer can make an offer");
        }

        if (req.getOfferPrice() == null || req.getOfferPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Offer price must be greater than zero");
        }

        // Create offer message.
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setMessageType(MessageType.OFFER);
        message.setOfferPrice(req.getOfferPrice());
        String text = "Offer: ₹" + req.getOfferPrice();
        if (req.getMessage() != null && !req.getMessage().isBlank()) {
            text += " - " + req.getMessage();
        }
        message.setMessage(text);
        message.setSentAt(Instant.now());
        message.setIsRead(false);

        // Updating last read.
        chatRoom.setLastMessageAt(message.getSentAt());
        chatRoomRepo.save(chatRoom);

        // save.
        Message savedMessage = messageRepo.save(message);

        // Mapping.
        MessageResponseDto responseDto = dto.mapToMessageResponseDto(savedMessage);
        return responseDto;
    }

    // Accepting or rejecting offer.
    @Transactional
    public MessageResponseDto acceptOrRejectOffer(Long messageId, OfferAction action) {
        AgoraUser currentUser = userService.getCurrentUser();

        Message offerMessage = messageRepo.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Offer message not found"));

        if (offerMessage.getMessageType() != MessageType.OFFER) {
            throw new IllegalArgumentException("Message is not an offer");
        }

        ChatRoom chatRoom = offerMessage.getChatRoom();
        if (!chatRoom.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only seller can accept or reject offer");
        }

        // New message.
        Message responseMessage = new Message();
        responseMessage.setChatRoom(chatRoom);
        responseMessage.setSender(currentUser);
        responseMessage.setSentAt(Instant.now());
        responseMessage.setIsRead(false);

        responseMessage.setMessageType(MessageType.OFFER_RESPONSE);

        String offerText = "Offer of ₹ " + offerMessage.getOfferPrice();
        if (action == OfferAction.ACCEPT) {
            responseMessage.setMessage("Accepted" + offerText);
        } else {
            responseMessage.setMessage("Rejected " + offerText);
        }

        // updating last read
        chatRoom.setLastMessageAt(responseMessage.getSentAt());
        chatRoomRepo.save(chatRoom);

        // response.
        Message savedResponse = messageRepo.save(responseMessage);

        return dto.mapToMessageResponseDto(savedResponse);

    }
}
