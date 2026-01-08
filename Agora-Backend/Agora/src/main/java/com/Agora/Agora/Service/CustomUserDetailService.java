package com.Agora.Agora.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailService.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("🔍 JWT username (phone): {}", username);

        AgoraUser user = userRepo.findByMobileNumber(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with phone: " + username));

        log.info("✅ User loaded: id={}, phone={}", user.getId(), user.getMobileNumber());

        return User.builder()
                .username(user.getMobileNumber())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();
    }

    private String extractPhoneNumber(String username) {
        String basePhone = username.contains("@") ? username.split("@")[0] : username;

        if (!basePhone.startsWith("+91")) {
            basePhone = "+91" + basePhone;
        }

        log.info("🔧 Extracted: {} → {}", username, basePhone);
        return basePhone;
    }

}

