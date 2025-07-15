package com.Agora.Agora.Dto.Request;

import java.math.BigDecimal;

import com.Agora.Agora.Model.Enums.OfferAction;

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
public class OfferReqDto {

    private Long chatRoomId;

    @NotNull(message = "Offer price is required")
    private BigDecimal offerPrice;

    @NotBlank(message = "Message cannot be blank")
    private String message;

    @NotNull(message = "Offer action is required")
    private OfferAction offerAction;
}
