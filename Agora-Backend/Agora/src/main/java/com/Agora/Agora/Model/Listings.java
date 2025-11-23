package com.Agora.Agora.Model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.Agora.Agora.Model.Enums.ItemCondition;
import com.Agora.Agora.Model.Enums.ItemStatus;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Listings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Listings Details.
    @Column(nullable = false, length = 50)
    private String title;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "10.0", message = "Price must be at least ₹10")
    @DecimalMax(value = "20000.0", message = "Price cannot exceed ₹10,000")
    @Column(nullable = false)
    private BigDecimal price;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private Instant postDate;

    @ElementCollection
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Builder.Default
    private List<ListingImage> images = new ArrayList<>();

    // Enums.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCondition itemCondition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus itemStatus;

    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false)
    // private ItemAvailability itemAvailability;

    // Relations.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private AgoraUser seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id")
    private College college;

}
