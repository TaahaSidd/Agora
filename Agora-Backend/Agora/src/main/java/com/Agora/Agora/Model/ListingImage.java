package com.Agora.Agora.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingImage {
    @Column(name = "image_url")
    private String url;

    @Column(name = "public_id")
    private String publicId;

}
