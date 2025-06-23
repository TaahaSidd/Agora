package com.Agora.Agora.Dto.Response;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponseDto {

    private Long id;
    private Long listingId;
    private Long buyerId;
    private Long sellerId;

    private String listingTitle;

    private String buyerUserName;
    private String sellerUserName;
    private String lastMessageText;

    private Instant createdAt;
    private Instant lastMessageAt;

    private Integer unreadMessageCounter;
}
