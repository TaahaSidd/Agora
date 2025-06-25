package com.Agora.Agora.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Service.ReportService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.Agora.Agora.Dto.Request.ReportReqDto;
import com.Agora.Agora.Dto.Response.ReportResponseDto;

@RestController
@RequestMapping("/Agora/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/Make")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReportResponseDto> fileReport(@RequestBody ReportReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.filReport(req));
    }

    

}
