package com.Agora.Agora.Repository;

import java.util.List;
import java.util.Optional;

import com.Agora.Agora.Model.Listings;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.AgoraUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<AgoraUser, Long> {
    Optional<AgoraUser> findByUserEmail(String userEmail);

    Optional<AgoraUser> findByMobileNumber(String mobileNumber);

    Optional<AgoraUser> findByUserName(String userName);

    boolean existsByUserName(String userName);

    @Query("SELECT CASE WHEN COUNT(ub) > 0 THEN true ELSE false END " +
            "FROM AgoraUser u JOIN u.blockedUsers ub " +
            "WHERE u.id = :blockerId AND ub.id = :blockedId")
    boolean existsBlockRelation(@Param("blockerId") Long blockerId,
                                @Param("blockedId") Long blockedId);

    @Query("SELECT l FROM Listings l WHERE l.seller.id = :sellerId " +
            "AND NOT EXISTS (" +
            "  SELECT 1 FROM AgoraUser u JOIN u.blockedUsers ub " +
            "  WHERE (u.id = :currentUserId AND ub.id = l.seller.id) " +
            "  OR (u.id = l.seller.id AND ub.id = :currentUserId)" +
            ")")
    List<Listings> findListingsVisibleToUser(@Param("currentUserId") Long currentUserId);

    @Query("SELECT u FROM AgoraUser u JOIN u.blockedUsers ub WHERE ub.id = :blockedUserId")
    List<AgoraUser> findUsersWhoBlockedUser(@Param("blockedUserId") Long blockedUserId);
}
