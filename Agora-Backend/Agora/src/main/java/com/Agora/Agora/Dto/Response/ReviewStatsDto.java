package com.Agora.Agora.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewStatsDto {
    private Double averageRating;
    private Long totalReviews;
}
