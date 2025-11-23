package com.Agora.Agora.Dto.Response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.Agora.Agora.Model.Enums.ItemAvailability;
import com.Agora.Agora.Model.Enums.ItemCondition;
import com.Agora.Agora.Model.Enums.ItemStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponseDto {

    private Long id;

    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private Instant postDate;
    private List<String> imageUrl;

    private ItemCondition itemCondition;
    private ItemStatus itemStatus;
    private ItemAvailability itemAvailability;

    private UserResponseDto seller;
    private CollegeResponseDto college;

    private String message;

}
