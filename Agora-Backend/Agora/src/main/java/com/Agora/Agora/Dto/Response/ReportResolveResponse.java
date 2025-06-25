package com.Agora.Agora.Dto.Response;

import java.time.Instant;

import com.Agora.Agora.Model.Enums.ReportStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportResolveResponse {

    private Long reportId;
    private ReportStatus status;
    private String moderationNotes;
    private Boolean actionOnUser;
    private Boolean actionOnListing;
    private Instant resolvedAt;
}
