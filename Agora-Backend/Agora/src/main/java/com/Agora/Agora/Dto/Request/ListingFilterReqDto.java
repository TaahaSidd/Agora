package com.Agora.Agora.Dto.Request;

import java.math.BigDecimal;

import com.Agora.Agora.Model.Enums.ItemCondition;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingFilterReqDto {

    private String keyword;
    private String title;
    private String category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private ItemCondition itemCondition;

    private Long collegeId;
    private String collegeName;
    private String sortBy;
    private String sortOrder;

    private int page;
    private int size;

}
