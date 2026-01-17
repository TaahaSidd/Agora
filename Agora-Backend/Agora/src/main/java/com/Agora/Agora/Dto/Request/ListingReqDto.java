package com.Agora.Agora.Dto.Request;

import com.Agora.Agora.Model.Enums.ItemCondition;
import com.Agora.Agora.Model.Enums.ItemStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

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
    @DecimalMin(value = "10.0", message = "Minimum price is ₹10")
    private BigDecimal price;
    @NotBlank(message = "Category cannot be null")
    private String category;

    private List<ImageDto> images;

    @NotNull(message = "Item condition is required")
    private ItemCondition itemCondition;
    private ItemStatus itemStatus;
    // private ItemAvailability itemAvailability; will be added once testing is done
    // and tables are dropped and created again.

}
