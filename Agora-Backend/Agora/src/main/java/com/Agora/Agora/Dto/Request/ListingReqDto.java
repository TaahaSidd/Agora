package com.Agora.Agora.Dto.Request;

import java.math.BigDecimal;

import com.Agora.Agora.Model.Enums.ItemCondition;
import com.Agora.Agora.Model.Enums.ItemStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingReqDto {

    @NotBlank(message = "Title cannot be blank")
    private String title;
    @NotBlank(message = "Description cannot be blank")
    private String description;
    @NotNull(message = "Enter a valid price")
    private BigDecimal price;
    @NotBlank(message = "Category cannot be null")
    private String category;

    // For image will use cloudinary - will be using that later for now no image
    private String image;

    @NotNull(message = "Item condition is required")
    private ItemCondition itemCondition;
    private ItemStatus itemStatus;
    // private ItemAvailability itemAvailability; will be added once testing is done
    // and tables are dropped and created again.

}
