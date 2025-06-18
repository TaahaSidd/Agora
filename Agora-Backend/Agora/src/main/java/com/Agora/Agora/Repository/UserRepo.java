package com.Agora.Agora.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Agora.Agora.Model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUserEmail(String userEmail);

    Optional<User> findByMobileNumber(String mobileNumber);

    Optional<User> findByUserName(String userName);
}
