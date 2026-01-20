package com.Agora.Agora.Model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.Agora.Agora.Model.Enums.MessageType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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
    @JsonIgnore
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private AgoraUser sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private AgoraUser recipient;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;
}
