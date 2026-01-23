package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Request.ListingFilterReqDto;
import com.Agora.Agora.Dto.Request.ListingReqDto;
import com.Agora.Agora.Dto.Response.CategoryCountResponseDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.ListingService;
import com.Agora.Agora.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
//    @GetMapping("/all")
//    public ResponseEntity<List<ListingResponseDto>> getAllListings() {
//        return ResponseEntity.ok(listingService.getAllListings());
//    }

    @GetMapping("/all")
    public ResponseEntity<Page<ListingResponseDto>> getAllListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            Authentication auth) {

        Long currentUserId = null;
        if (auth != null && auth.isAuthenticated()) {
            AgoraUser user = (AgoraUser) auth.getPrincipal();
            currentUserId = user.getId();
        }

        return ResponseEntity.ok(listingService.getAllListings(page, size, sortBy, sortDir, currentUserId));
    }

    // Updating
    @PutMapping("update/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingResponseDto> updateListing(@Valid @PathVariable Long id,
                                                            @Valid @RequestBody ListingReqDto req) {
        return ResponseEntity.ok(listingService.updateListing(id, req));
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.deleteListingCloudinary(id);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/search")
//    public ResponseEntity<List<ListingResponseDto>> searchListings(
//            @Valid @RequestBody ListingFilterReqDto req,
//            Authentication authentication
//    ) {
//        Long currentUserId = null;
//
//        if (authentication != null && authentication.isAuthenticated()
//                && !(authentication instanceof AnonymousAuthenticationToken)) {
//
//            AgoraUser user = userService.findByMobileNumber(authentication.getName());
//            currentUserId = user.getId();
//        }
//
//        List<ListingResponseDto> results = listingService.searchListings(req, currentUserId);
//        return ResponseEntity.ok(results);
//    }

    @PostMapping("/search")
    public ResponseEntity<List<ListingResponseDto>> searchListings(
            @Valid @RequestBody ListingFilterReqDto req,
            @AuthenticationPrincipal AgoraUser user) {

        Long currentUserId = (user != null) ? user.getId() : null;

        List<ListingResponseDto> results = listingService.searchListings(req, currentUserId);
        return ResponseEntity.ok(results);
    }


    @GetMapping("/my-listings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ListingResponseDto>> getMyListings(Authentication authentication) {
        AgoraUser currentUser = userService.getCurrentUser();
        List<ListingResponseDto> listings = listingService.getListingByUserId(currentUser.getId());
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/popular-categories")
    public ResponseEntity<List<CategoryCountResponseDto>> getPopularCategories() {
        return ResponseEntity.ok(listingService.getPopularCategories());
    }

}
