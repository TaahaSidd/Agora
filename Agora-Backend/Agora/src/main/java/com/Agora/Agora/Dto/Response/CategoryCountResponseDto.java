package com.Agora.Agora.Dto.Response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryCountResponseDto {

    private String categoryId;

    private String categoryName;
    private Long itemCount;

    public CategoryCountResponseDto(String categoryId, String categoryName, Long itemCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.itemCount = itemCount;
    }
}
