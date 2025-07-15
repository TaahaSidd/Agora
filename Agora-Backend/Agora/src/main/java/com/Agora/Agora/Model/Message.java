package com.Agora.Agora.Model;

import java.math.BigDecimal;
import java.time.Instant;

import com.Agora.Agora.Model.Enums.MessageType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;
    @Column(nullable = false)
    private Instant sentAt;
    @Column(nullable = false)
    private Boolean isRead;
    @Column(nullable = false)
    private BigDecimal offerPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoom chatRoom;
    @ManyToOne(fetch = FetchType.LAZY)
    private AgoraUser sender;

    @ManyToOne(fetch = FetchType.LAZY)
    private AgoraUser recipient;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

}
