package com.Agora.Agora.Dto.Request;

import java.math.BigDecimal;

// import com.Agora.Agora.Model.Enums.ItemAvailability;
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
public class ListingReqDto {

    private String title;
    private String description;
    private BigDecimal price;
    private String category;

    // For image will use cloudinary - will be using that later for now no image
    private String image;

    private ItemCondition itemCondition;
    private ItemStatus itemStatus;
    // private ItemAvailability itemAvailability; will be added once testing is done
    // and tables are dropped and created again.

}
