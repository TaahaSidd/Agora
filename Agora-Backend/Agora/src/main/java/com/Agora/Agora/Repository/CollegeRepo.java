package com.Agora.Agora.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Agora.Agora.Model.College;

public interface CollegeRepo extends JpaRepository<College, Long> {
    Optional<College> findByCollegeNameIgnoreCase(String collegeName);

    @Query("SELECT c FROM College c WHERE LOWER(c.collegeName) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY c.collegeName ASC")
    List<College> searchByCollegeName(@Param("query") String query, Pageable pageable);
}
