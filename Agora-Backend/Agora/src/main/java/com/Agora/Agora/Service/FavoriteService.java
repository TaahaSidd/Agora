package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Favorite;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Repository.FavoriteRepo;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepo favoriteRepo;
    private final UserRepo userRepo;
    private final ListingsRepo listingsRepo;
    private final DtoMapper dto;
    private final NotificationService notificationService;

    @Transactional
    public ListingResponseDto addFavorite(String username, Long listingId) {

        AgoraUser user = userRepo.findByMobileNumber(username)
                .orElseGet(() -> userRepo.findByUserEmail(username)
                        .orElseThrow(() -> new EntityNotFoundException("User not found")));

        Listings listing = listingsRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        if (favoriteRepo.findByUserAndListing(user, listing).isPresent()) {
            throw new IllegalStateException("Already favorite");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setListing(listing);
        favoriteRepo.save(favorite);

        AgoraUser receiver = listing.getSeller();
        notificationService.sendListingLikedNotification(receiver, listing, user);

        return dto.mapToListingResponseDto(listing);
    }

    @Transactional
    public ListingResponseDto removeFavorite(String username, Long listingId) {

        AgoraUser user = userRepo.findByMobileNumber(username)
                .orElseGet(() -> userRepo.findByUserEmail(username)
                        .orElseThrow(() -> new EntityNotFoundException("User not found")));

        Listings listing = listingsRepo.findById(listingId)
                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        Favorite favorite = favoriteRepo.findByUserAndListing(user, listing)
                .orElseThrow(() -> new EntityNotFoundException("Favorite not found"));

        favoriteRepo.delete(favorite);
        return dto.mapToListingResponseDto(listing);
    }

    public List<ListingResponseDto> getUserFavoritesById(Long userId) {
        AgoraUser user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User ID " + userId + " not found"));

        return favoriteRepo.findAllByUser(user).stream()
                .map(fav -> dto.mapToListingResponseDto(fav.getListing()))
                .toList();
    }
}
