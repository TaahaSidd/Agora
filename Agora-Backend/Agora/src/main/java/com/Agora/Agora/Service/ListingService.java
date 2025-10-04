package com.Agora.Agora.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.ListingFilterReqDto;
import com.Agora.Agora.Dto.Request.ListingReqDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.Enums.ItemStatus;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Repository.ListingSearchRepo;
import com.Agora.Agora.Repository.ListingsRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListingService {

    // private final UserRepo userRepo;
    private final UserService userService;
    private final ListingsRepo listingRepo;
    private final DtoMapper dto;

    @Transactional
    public ListingResponseDto createListing(ListingReqDto req) {
        AgoraUser currentUser = userService.getCurrentUser();

        College college = currentUser.getCollege();
        if (college == null) {
            throw new EntityNotFoundException("User is not linked to any college");
        }

        Listings listing = new Listings();

        listing.setTitle(req.getTitle());
        listing.setDescription(req.getDescription());
        listing.setPrice(req.getPrice());
        listing.setCategory(req.getCategory());
        listing.setPostDate(Instant.now());
        listing.setItemCondition(req.getItemCondition());
        listing.setItemStatus(ItemStatus.AVAILABLE);

        listing.setSeller(currentUser);
        listing.setCollege(college);

        Listings savedListing = listingRepo.save(listing);

        ListingResponseDto responseDto = dto.mapToListingResponseDto(savedListing);
        return responseDto;
    }

    public ListingResponseDto getListingById(Long id) {
        Listings listing = listingRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Listing not found with id: " + id));

        return dto.mapToListingResponseDto(listing);
    }

    public List<ListingResponseDto> getAllListings() {
        List<Listings> listing = listingRepo.findAll();

        return listing.stream()
                .map(dto::mapToListingResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ListingResponseDto updateListing(Long listingId, ListingReqDto req) {
        AgoraUser currentUser = userService.getCurrentUser();

        Listings updatedListings = listingRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Cant update listing"));

        if (!updatedListings.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Permission Denied");
        }

        if (req.getTitle() != null)
            updatedListings.setTitle(req.getTitle());
        if (req.getDescription() != null)
            updatedListings.setDescription(req.getDescription());
        if (req.getPrice() != null)
            updatedListings.setPrice(req.getPrice());
        if (req.getCategory() != null)
            updatedListings.setCategory(req.getCategory());
        if (req.getItemCondition() != null)
            updatedListings.setItemCondition(req.getItemCondition());
        if (req.getItemStatus() != null)
            updatedListings.setItemStatus(req.getItemStatus());

        Listings updatedListing = listingRepo.save(updatedListings);

        ListingResponseDto responseDto = dto.mapToListingResponseDto(updatedListing);

        return responseDto;
    }

    public void deleteListing(Long listingId) {

        if (listingId == null) {
            throw new IllegalArgumentException("Listing id is required");
        }

        if (!listingRepo.existsById(listingId)) {
            throw new EntityNotFoundException("Listing not found");
        }
        listingRepo.deleteById(listingId);
    }

    @SuppressWarnings("removal")
    public List<ListingResponseDto> searchListings(ListingFilterReqDto req) {
        Specification<Listings> spec = Specification.where(null);

        if (req.getKeyword() != null && !req.getKeyword().isEmpty()) {
            spec = spec.and(ListingSearchRepo.searchByKeyword(req.getKeyword()));
        }

        if (req.getTitle() != null && !req.getTitle().isEmpty()) {
            spec = spec.and(ListingSearchRepo.searchByTitle(req.getTitle()));
        }

        if (req.getCategory() != null && !req.getCategory().isEmpty()) {
            spec = spec.and(ListingSearchRepo.searchByCategory(req.getCategory()));
        }

        if (req.getMinPrice() != null || req.getMaxPrice() != null) {
            spec = spec.and(ListingSearchRepo.searchByPrice(req.getMinPrice(), req.getMaxPrice()));
        }

        if (req.getItemCondition() != null) {
            spec = spec.and(ListingSearchRepo.searchByCondition(req.getItemCondition()));
        }

        if (req.getCollegeId() != null) {
            spec = spec.and(ListingSearchRepo.searchByCollegeId(req.getCollegeId()));
        }

        if (req.getCollegeName() != null && req.getCollegeName().isEmpty()) {
            spec = spec.and(ListingSearchRepo.searchByCollegeName(req.getCollegeName()));
        }

        List<Listings> searchListings = listingRepo.findAll(spec);

        List<ListingResponseDto> responseDtos = searchListings.stream()
                .map(dto::mapToListingResponseDto)
                .collect(Collectors.toList());

        return responseDtos;
    }

    @Transactional
    public void deactivateListing(Long listingId) {
        Listings listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));
        listing.setItemStatus(ItemStatus.DEACTIVATED);
        listingRepo.save(listing);
    }

    public List<ListingResponseDto> getListingByUserId(Long userId) {
        List<Listings> listings = listingRepo.findAllBySellerId(userId);
        List<ListingResponseDto> responseDto = listings.stream().map(dto::mapToListingResponseDto)
                .collect(Collectors.toList());
        return responseDto;
    }

}
