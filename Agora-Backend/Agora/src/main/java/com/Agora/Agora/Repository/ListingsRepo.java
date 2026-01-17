package com.Agora.Agora.Repository;

import com.Agora.Agora.Dto.Response.CategoryCountResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Enums.ItemStatus;
import com.Agora.Agora.Model.Listings;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ListingsRepo extends JpaRepository<Listings, Long>, JpaSpecificationExecutor<Listings> {
    List<Listings> findAllBySellerId(Long sellerId);

    public static Specification<Listings> excludeBlockedUsers(Set<Long> blockedIds) {
        return (root, query, cb) -> {
            if (blockedIds == null || blockedIds.isEmpty()) {
                return cb.conjunction();
            }
            return cb.not(root.get("seller").get("id").in(blockedIds));
        };
    }

    @Query("SELECT new com.Agora.Agora.Dto.Response.CategoryCountResponseDto(l.category, l.category, COUNT(l)) " +
            "FROM Listings l " +
            "GROUP BY l.category " +
            "ORDER BY COUNT(l) DESC")
    List<CategoryCountResponseDto> findPopularCategories();

    @Modifying
    @Transactional
    @Query("UPDATE Listings l SET l.itemStatus = :status WHERE l.seller.id = :sellerId")
    void deactivateAllBySellerId(@Param("sellerId") Long sellerId, @Param("status") ItemStatus status);


    @Query("SELECT l FROM Listings l WHERE l.itemStatus = 'AVAILABLE' " +
            "AND l.seller.id NOT IN (" +
            "  SELECT b.id FROM AgoraUser u JOIN u.blockedUsers b WHERE u.id = :currentUserId" +
            ") " +
            "AND l.seller.id NOT IN (" +
            "  SELECT u.id FROM AgoraUser u JOIN u.blockedByUsers u2 WHERE u.id = :currentUserId" +
            ")")
    Page<Listings> findAllAvailableFiltered(@Param("currentUserId") Long currentUserId, Pageable pageable);

    Page<Listings> findByItemStatus(ItemStatus itemStatus, Pageable pageable);


    @Modifying
    @Query("UPDATE Listings l SET l.itemStatus = 'ARCHIVED' WHERE l.seller = :seller")
    void archiveAllBySeller(@Param("seller") AgoraUser seller);

    List<Listings> findBySeller(AgoraUser seller);

    @Modifying
    @Transactional
    void deleteBySeller(AgoraUser seller);
}
