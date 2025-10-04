package com.Agora.Agora.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.Agora.Agora.Model.Listings;

public interface ListingsRepo extends JpaRepository<Listings, Long>, JpaSpecificationExecutor<Listings> {
    List<Listings> findAllBySellerId(Long sellerId);
}
