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

import com.Agora.Agora.Dto.Request.ListingFilterReqDto;
import com.Agora.Agora.Dto.Request.ListingReqDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Service.ListingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/Agora/listing")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    // Create.
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingResponseDto> createListing(@RequestBody ListingReqDto req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(listingService.createListing(req));
    }

    // Get Listing by ID.
    @GetMapping("/id")
    public ResponseEntity<ListingResponseDto> getListingById(Long id) {
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
    public ResponseEntity<ListingResponseDto> updateListing(@PathVariable Long id, @RequestBody ListingReqDto req) {
        return ResponseEntity.ok(listingService.updateListing(id, req));
    }

    // Delete.
    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }

    // Searching.
    @PostMapping("/search")
    public ResponseEntity<List<ListingResponseDto>> searchListings(@RequestBody ListingFilterReqDto req) {
        List<ListingResponseDto> results = listingService.searchListings(req);
        return ResponseEntity.ok(results);
    }

}
