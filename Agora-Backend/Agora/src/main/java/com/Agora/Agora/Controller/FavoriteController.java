package com.Agora.Agora.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Service.FavoriteService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("Agora/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{listingId}")
    public ResponseEntity<ListingResponseDto> addFavorite(@PathVariable Long listingId, Authentication authentication) {
        String userEmail = authentication.getName();
        ListingResponseDto response = favoriteService.addFavorite(userEmail, listingId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<ListingResponseDto> removeFavorite(@PathVariable Long listingId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        ListingResponseDto response = favoriteService.removeFavorite(userEmail, listingId);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ListingResponseDto>> getAllFavorite(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ListingResponseDto> favorites = favoriteService.getUserFavorites(userEmail);
        return ResponseEntity.ok(favorites);
    }

}
