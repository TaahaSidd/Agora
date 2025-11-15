package com.Agora.Agora.Dto.Request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReqDto {

    @NotNull
    private Long listingId;
    @NotNull
    private Long reviewerId;
    @NotNull
    private Integer rating;
    @Size(max = 800)
    private String comment;
}
