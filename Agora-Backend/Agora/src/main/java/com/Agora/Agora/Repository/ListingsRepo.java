package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.Agora.Agora.Dto.Response.CategoryCountResponseDto;
import com.Agora.Agora.Model.Listings;

public interface ListingsRepo extends JpaRepository<Listings, Long>, JpaSpecificationExecutor<Listings> {
    List<Listings> findAllBySellerId(Long sellerId);

    @Query("SELECT new com.Agora.Agora.Dto.Response.CategoryCountResponseDto(l.category, l.category, COUNT(l)) " +
            "FROM Listings l " +
            "GROUP BY l.category " +
            "ORDER BY COUNT(l) DESC")
    List<CategoryCountResponseDto> findPopularCategories();
}
