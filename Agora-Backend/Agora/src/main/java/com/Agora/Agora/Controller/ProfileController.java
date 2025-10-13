package com.Agora.Agora.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.UserReqDto;
import com.Agora.Agora.Dto.Response.UserResponseDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.UserService;
import com.Agora.Agora.Service.ListingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/profile")
@RequiredArgsConstructor
public class ProfileController {

    // private final UserRepo userRepo;
    private final UserService userService;
    private final ListingService listingService;

    @GetMapping("/myProfile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AgoraUser> myProfile() {
        AgoraUser currentUser = userService.getCurrentUser();

        return ResponseEntity.ok(currentUser);
    }

    // Updating profile for authenticated users.
    @PutMapping("/update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDto> updateProfile(@Valid @PathVariable Long id,
            @Valid @RequestBody UserReqDto req) {

        UserResponseDto responseDTO = userService.updateUser(id, req);

        return ResponseEntity.ok(responseDTO);
    }

    // Seller's profile
    @GetMapping("/seller/{userId}")
    public ResponseEntity<Map<String, Object>> getSellerProfile(@PathVariable Long userId) {
        UserResponseDto sellerInfo = userService.findById(userId);

        List<ListingResponseDto> listing = listingService.getListingByUserId(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("seller", sellerInfo);
        response.put("listing", listing);

        return ResponseEntity.ok(response);

    }

}
