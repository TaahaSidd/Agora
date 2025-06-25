package com.Agora.Agora.Dto.Request;

import com.Agora.Agora.Model.Enums.ReportReason;
import com.Agora.Agora.Model.Enums.ReportType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportReqDto {

    private Long reportedUserId;
    private Long reportedListingId;
    private ReportType reportType;
    private ReportReason reportReason;
    private String customReason;
    private Long targetId;

}
