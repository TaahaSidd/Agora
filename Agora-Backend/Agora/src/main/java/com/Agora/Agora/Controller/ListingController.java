package com.Agora.Agora.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.ListingFilterReqDto;
import com.Agora.Agora.Dto.Request.ListingReqDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.ListingService;
import com.Agora.Agora.Service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("Agora/listing")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final UserService userService;

    // Create.
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingResponseDto> createListing(@Valid @RequestBody ListingReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(listingService.createListing(req));
    }

    // Get Listing by ID.
    @GetMapping("/{id}")
    public ResponseEntity<ListingResponseDto> getListingById(@Valid @PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    // Get All Listings
    @GetMapping("/all")
    public ResponseEntity<List<ListingResponseDto>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }

    // Updating
    @PutMapping("update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingResponseDto> updateListing(@Valid @PathVariable Long id,
            @Valid @RequestBody ListingReqDto req) {
        return ResponseEntity.ok(listingService.updateListing(id, req));
    }

    // Delete.
    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteListing(@Valid @PathVariable Long id) {
        listingService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }

    // Searching.
    @PostMapping("/search")
    public ResponseEntity<List<ListingResponseDto>> searchListings(@Valid @RequestBody ListingFilterReqDto req) {
        List<ListingResponseDto> results = listingService.searchListings(req);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/my-listings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ListingResponseDto>> getMyListings(Authentication authentication) {
        AgoraUser currentUser = userService.getCurrentUser();
        List<ListingResponseDto> listings = listingService.getListingByUserId(currentUser.getId());
        return ResponseEntity.ok(listings);
    }

}
