package com.Agora.Agora.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.MessageRequestDto;
import com.Agora.Agora.Dto.Request.OfferReqDto;
import com.Agora.Agora.Dto.Response.ChatRoomResponseDto;
import com.Agora.Agora.Dto.Response.MessageResponseDto;
import com.Agora.Agora.Service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/Agora/ChatRoom")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{listingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatRoomResponseDto> createRoom(@Valid @PathVariable Long listingId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.getOrCreateChatRoom(listingId));
    }

    @PostMapping("/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponseDto> sendMessage(@Valid @RequestBody MessageRequestDto req) {
        return ResponseEntity.ok(chatService.sendMessage(req));
    }

    @GetMapping("/messages/{chatRoomId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponseDto>> getMessages(@Valid @PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatService.getMessagesInChatRoom(chatRoomId));
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChatRoomResponseDto>> getChatRoom() {
        return ResponseEntity.ok(chatService.getUserChatRooms());
    }

    @PostMapping("/offers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponseDto> handleOffer(@Valid @RequestBody OfferReqDto req) {
        return ResponseEntity.ok(chatService.makeOffer(req));
    }

}
