package com.Agora.Agora.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Request.ReviewReqDto;
import com.Agora.Agora.Dto.Response.ReviewResponse;
import com.Agora.Agora.Service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("Agora/Review")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{listingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long listingId,
            @RequestBody ReviewReqDto req,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addReview(listingId, email, req));
    }

    @PostMapping("/seller/{sellerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> createSellerReview(
            @PathVariable Long sellerId,
            @RequestBody ReviewReqDto req,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addSellerReview(sellerId, email, req));
    }

    @GetMapping("/{listingId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForListings(@PathVariable Long listingId) {
        return ResponseEntity.ok(reviewService.getReviewsForListing(listingId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/seller/{sellerId}/avg")
    public ResponseEntity<Double> getSellerAverageRating(@PathVariable Long sellerId) {
        Double avg = reviewService.getAverageRatingForSeller(sellerId);
        return ResponseEntity.ok(avg != null ? avg : 0.0);
    }

    @GetMapping("/user/{userId}/avg")
    public ResponseEntity<Double> getUserAverageRating(@PathVariable Long userId) {
        Double avg = reviewService.getAverageRatingByUser(userId);
        return ResponseEntity.ok(avg != null ? avg : 0.0);
    }
}
