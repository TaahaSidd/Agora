package com.Agora.Agora.Service;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailService.class);

//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        log.info("🔍 JWT identifier received: {}", username);
//        String formattedPhone = extractPhoneNumber(username);
//
//        return userRepo.findByMobileNumber(formattedPhone)
//                .orElseThrow(() -> new UsernameNotFoundException(
//                        "User not found with phone: " + formattedPhone));
//    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("🔍 JWT identifier received: {}", username);
        String formattedPhone = extractPhoneNumber(username);

        AgoraUser user = userRepo.findByMobileNumber(formattedPhone)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with phone: " + formattedPhone));

        if (user.getUserStatus() == UserStatus.DELETED) {
            log.warn("🚫 Access denied: User {} has been deleted.", formattedPhone);
            throw new UsernameNotFoundException("This account has been deactivated.");
        }

        return user;
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

