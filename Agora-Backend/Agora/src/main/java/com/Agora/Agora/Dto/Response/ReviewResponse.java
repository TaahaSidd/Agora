package com.Agora.Agora.Dto.Response;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;

    private Long listingId;
    private Long reviewerId;
    private Long sellerId;

    private String reviewerName;
    private String reviewerEmail;

    private int rating;

    private String comment;
    private Instant createdAt;
}
