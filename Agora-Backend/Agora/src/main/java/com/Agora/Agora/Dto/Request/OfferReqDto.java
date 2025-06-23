package com.Agora.Agora.Dto.Request;

import java.math.BigDecimal;

import com.Agora.Agora.Model.Enums.OfferAction;

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

    private BigDecimal offerPrice;
    private String message;

    private OfferAction offerAction;
}
