package com.Agora.Agora.Controller;

import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Agora/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{listingId}")
    public ResponseEntity<ListingResponseDto> addFavorite(@PathVariable Long listingId, Authentication authentication) {
        String username = authentication.getName();
        ListingResponseDto response = favoriteService.addFavorite(username, listingId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<ListingResponseDto> removeFavorite(@PathVariable Long listingId, Authentication authentication) {
        String username = authentication.getName();
        ListingResponseDto response = favoriteService.removeFavorite(username, listingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ListingResponseDto>> getFavorites(Authentication authentication) {
        AgoraUser user = (AgoraUser) authentication.getPrincipal();
        return ResponseEntity.ok(favoriteService.getUserFavoritesById(user.getId()));
    }

}
