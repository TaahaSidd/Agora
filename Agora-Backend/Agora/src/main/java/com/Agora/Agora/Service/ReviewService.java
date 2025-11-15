package com.Agora.Agora.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.ReviewReqDto;
import com.Agora.Agora.Dto.Response.ReviewResponse;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Review;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.ReviewRepo;
import com.Agora.Agora.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

        private final ReviewRepo reviewRepo;
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
                return dto.mapToReviewResponseDto(savedReview);
        }

        public ReviewResponse addSellerReview(Long sellerId, String email, ReviewReqDto req) {
                AgoraUser seller = userRepo.findById(sellerId)
                                .orElseThrow(() -> new RuntimeException("Seller not Found!"));

                AgoraUser reviewer = userRepo.findByUserEmail(email)
                                .orElseThrow(() -> new RuntimeException("Reviewer not Found!"));

                Review review = new Review();
                review.setSeller(seller);
                review.setReviewer(reviewer);
                review.setRating(req.getRating());
                review.setComment(req.getComment());

                Review savedReview = reviewRepo.save(review);
                return dto.mapToReviewResponseDto(savedReview);
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

        public Double getAverageRatingByUser(Long userId) {
                return reviewRepo.findAverageRatingByUser(userId);
        }

}
