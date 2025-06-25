package com.Agora.Agora.Dto.Request;

import com.Agora.Agora.Model.Enums.ReportStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportResolveReqDto {

    private ReportStatus status;
    private String moderationNotes;
    private Boolean actionOnUser;
    private Boolean actionOnListing;

}
