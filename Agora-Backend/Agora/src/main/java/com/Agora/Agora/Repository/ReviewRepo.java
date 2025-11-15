package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Agora.Agora.Model.Review;

public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByListing_Id(Long listingId);

    List<Review> findByReviewer_Id(Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.seller.id = :sellerId")
    Double findAverageRatingForSeller(@Param("sellerId") Long sellerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewer.id = :userId")
    Double findAverageRatingByUser(@Param("userId") Long userId);
}
