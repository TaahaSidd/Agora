package com.Agora.Agora.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Favorite;

public interface FavoriteRepo extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUser(AgoraUser user);

    Optional<Favorite> findByUserAndListing(AgoraUser user, Listings listing);

    List<Favorite> findAllByUser(AgoraUser user);

}
