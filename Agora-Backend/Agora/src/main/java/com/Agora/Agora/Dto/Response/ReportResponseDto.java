package com.Agora.Agora.Dto.Response;

import java.time.Instant;

import com.Agora.Agora.Model.Enums.ReportReason;
import com.Agora.Agora.Model.Enums.ReportStatus;
import com.Agora.Agora.Model.Enums.ReportType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDto {

    private Long id;
    private Long reporterId;
    private Long reportedId;
    private Long listingId;

    private String reporterUserName;
    private String reportedUserName;
    private String reportedListingTitle;

    private ReportType reportType;
    private ReportStatus reportStatus;
    private ReportReason reportReason;

    private Instant reportedAt;
    private Instant resolvedAt;

}
