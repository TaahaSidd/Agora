package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.ReviewReqDto;
import com.Agora.Agora.Dto.Response.ReviewResponse;
import com.Agora.Agora.Dto.Response.ReviewStatsDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Review;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.ReviewRepo;
import com.Agora.Agora.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepo reviewRepo;
    private final NotificationService notificationService;
    private final ListingsRepo listingRepo;
    private final UserRepo userRepo;
    private final DtoMapper dto;

    public ReviewResponse addReview(Long listingId, String email, ReviewReqDto req) {
        Listings listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        AgoraUser reviewer = userRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setListing(listing);
        review.setReviewer(reviewer);
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        Review savedReview = reviewRepo.save(review);

        notificationService.createReviewNotification(reviewer, listing);

        return dto.mapToReviewResponseDto(savedReview);
    }

//    public ReviewResponse addSellerReview(Long sellerId, String email, ReviewReqDto req) {
//        AgoraUser seller = userRepo.findById(sellerId)
//                .orElseThrow(() -> new RuntimeException("Seller not Found!"));
//
//        AgoraUser reviewer = userRepo.findByUserEmail(email)
//                .orElseThrow(() -> new RuntimeException("Reviewer not Found!"));
//
//        Review review = new Review();
//        review.setSeller(seller);
//        review.setReviewer(reviewer);
//        review.setRating(req.getRating());
//        review.setComment(req.getComment());
//
//        Review savedReview = reviewRepo.save(review);
//        return dto.mapToReviewResponseDto(savedReview);
//    }

//    public ReviewResponse addSellerReview(Long sellerId, String principalName, ReviewReqDto req) {
//        AgoraUser seller = userRepo.findById(sellerId)
//                .orElseThrow(() -> new RuntimeException("Seller not Found!"));
//
//        String formattedPhone = extractPhoneNumber(principalName);
//
//        AgoraUser reviewer = userRepo.findByMobileNumber(formattedPhone)
//                .orElseThrow(() -> new RuntimeException("Reviewer not Found with phone: " + formattedPhone));
//
//        if (reviewer.getId().equals(sellerId)) {
//            throw new RuntimeException("You cannot rate your own profile!");
//        }
//
//        Review review = new Review();
//        review.setSeller(seller);
//        review.setReviewer(reviewer);
//        review.setRating(req.getRating());
//        review.setComment(req.getComment());
//
//        Review savedReview = reviewRepo.save(review);
//        return dto.mapToReviewResponseDto(savedReview);
//    }

    public ReviewResponse addSellerReview(Long sellerId, String email, ReviewReqDto req) {
        // 1. Find the Seller
        AgoraUser seller = userRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not Found!"));

        // 2. Find the Reviewer using EMAIL (Directly from the Principal)
        // ✅ No more extractPhoneNumber logic needed!
        AgoraUser reviewer = userRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Reviewer not Found with email: " + email));

        // 3. Prevent self-rating
        if (reviewer.getId().equals(sellerId)) {
            throw new RuntimeException("You cannot rate your own profile!");
        }

        // 4. Create and Save Review
        Review review = new Review();
        review.setSeller(seller);
        review.setReviewer(reviewer);
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        Review savedReview = reviewRepo.save(review);
        return dto.mapToReviewResponseDto(savedReview);
    }

// 🗑️ You can safely delete the extractPhoneNumber method now

    private String extractPhoneNumber(String username) {
        String basePhone = username.contains("@") ? username.split("@")[0] : username;
        if (!basePhone.startsWith("+91")) {
            basePhone = "+91" + basePhone;
        }
        return basePhone;
    }

    public List<ReviewResponse> getReviewsForListing(Long listingId) {
        @SuppressWarnings("unused")
        Listings listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        List<Review> reviews = reviewRepo.findByListing_Id(listingId);

        return reviews.stream()
                .map(dto::mapToReviewResponseDto)
                .toList();
    }

    public List<ReviewResponse> getReviewsByUser(Long userId) {
        List<Review> reviews = reviewRepo.findByReviewer_Id(userId);

        return reviews.stream()
                .map(dto::mapToReviewResponseDto)
                .toList();
    }

    public Double getAverageRatingForSeller(Long sellerId) {
        return reviewRepo.findAverageRatingForSeller(sellerId);
    }

    public ReviewStatsDto getSellerStats(Long sellerId) {
        Double avg = reviewRepo.findAverageRatingForSeller(sellerId);

        Long count = reviewRepo.countBySellerId(sellerId);

        return new ReviewStatsDto(
                avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0,
                count != null ? count : 0L
        );
    }

    public Double getAverageRatingByUser(Long userId) {
        return reviewRepo.findAverageRatingByUser(userId);
    }

}
