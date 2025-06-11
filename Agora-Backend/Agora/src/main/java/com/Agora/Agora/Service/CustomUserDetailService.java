package com.Agora.Agora.Service;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUserEmail(username)
                .map(userEntity ->

                new org.springframework.security.core.userdetails.User(
                        userEntity.getUserEmail(),
                        userEntity.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userEntity.getRole()))

                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }
}
