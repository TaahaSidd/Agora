package com.Agora.Agora.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.CollegeReqDto;
import com.Agora.Agora.Dto.Response.CollegeResponseDto;
import com.Agora.Agora.Service.CollegeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/college")
@RequiredArgsConstructor
public class CollegeController {

    private final CollegeService collegeService;

    // Add college.
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CollegeResponseDto> addCollege(@Valid @RequestBody CollegeReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collegeService.addCollege(req));
    }

    // Get all colleges
    @GetMapping("/colleges")
    public ResponseEntity<List<CollegeResponseDto>> getAllColleges() {
        return ResponseEntity.ok(collegeService.getAllColleges());
    }

    // Get college by id.
    @GetMapping("/college/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CollegeResponseDto> getCollegeById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(collegeService.getCollegeById(id));
    }

    // Update College.
    @PutMapping("/college/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<CollegeResponseDto> updateCollege(@Valid @PathVariable Long id,
            @Valid @RequestBody CollegeReqDto req) {
        return ResponseEntity.ok(collegeService.updateCollege(id, req));
    }

    // Delete College.
    @DeleteMapping("/college/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCollege(@Valid @PathVariable Long id) {
        collegeService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

}
