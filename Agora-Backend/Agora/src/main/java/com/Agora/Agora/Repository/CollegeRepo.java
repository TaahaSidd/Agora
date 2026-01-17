package com.Agora.Agora.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.College;

import java.util.Optional;

public interface CollegeRepo extends JpaRepository<College, Long> {
    Optional<College> findByCollegeNameIgnoreCase(String collegeName);

}
