package com.Agora.Agora.Model;

import java.time.Instant;

import com.Agora.Agora.Model.Enums.ReportReason;
import com.Agora.Agora.Model.Enums.ReportStatus;
import com.Agora.Agora.Model.Enums.ReportType;

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
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReportType reportType;

    @Enumerated(EnumType.STRING)
    private ReportReason reason;

    @ManyToOne(fetch = FetchType.LAZY)
    private AgoraUser reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    private AgoraUser reportedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    private Listings listings;

    @Column(nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Column(nullable = false)
    private Instant reportedAt;
    @Column(nullable = true)
    private Instant resolvedAt;

    private String moderationNotes;

}
