package com.Agora.Agora.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Favorite;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Repository.FavoriteRepo;
import com.Agora.Agora.Repository.ListingsRepo;
import com.Agora.Agora.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import com.Agora.Agora.Mapper.DtoMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

        private final FavoriteRepo favoriteRepo;
        private final UserRepo userRepo;
        private final ListingsRepo listingsRepo;
        private final DtoMapper dto;

        @Transactional
        public ListingResponseDto addFavorite(String userEmail, Long listingId) {

                AgoraUser user = userRepo.findByUserEmail(userEmail)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                Listings listing = listingsRepo.findById(listingId)
                                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));

                if (favoriteRepo.findByUserAndListing(user, listing).isPresent()) {
                        throw new IllegalStateException("Already favorite");
                }

                Favorite favorite = new Favorite();
                favorite.setUser(user);
                favorite.setListing(listing);
                favoriteRepo.save(favorite);

                return dto.mapToListingResponseDto(listing);
        }

        @Transactional
        public ListingResponseDto removeFavorite(String userEmail, Long listingId) {
                AgoraUser user = userRepo.findByUserEmail(userEmail)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                Listings listing = listingsRepo.findById(listingId)
                                .orElseThrow(() -> new EntityNotFoundException("Listing not found"));

                Favorite favorite = favoriteRepo.findByUserAndListing(user, listing)
                                .orElseThrow(() -> new EntityNotFoundException("Favorite not found"));

                favoriteRepo.delete(favorite);
                return dto.mapToListingResponseDto(listing);
        }

        public List<ListingResponseDto> getUserFavorites(String userEmail) {
                AgoraUser user = userRepo.findByUserEmail(userEmail)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                List<Favorite> favorites = favoriteRepo.findAllByUser(user);

                return favorites.stream()
                                .map(fav -> dto.mapToListingResponseDto(fav.getListing()))
                                .toList();
        }
}
