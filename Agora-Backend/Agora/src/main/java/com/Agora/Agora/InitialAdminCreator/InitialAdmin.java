package com.Agora.Agora.InitialAdminCreator;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Model.User;
import com.Agora.Agora.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class InitialAdmin {

    private static final Logger log = LoggerFactory.getLogger(InitialAdmin.class);

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner createAdmin() {
        return args -> {

            if (userRepo.findByUserEmail("admin@gmail.com").isEmpty()) {
                log.info("Creating Initial Admin User...");

                User adminUser = User.builder()
                        .userName("Admin")
                        .firstName("System")
                        .lastName("Admin")
                        .userEmail("admin@gmail.com")
                        .mobileNumber("1234598760")
                        .password(passwordEncoder.encode("ADMINPASSWORD"))
                        .role(UserRole.ADMIN)
                        .collegeId("SYS_ADMIN_CLG")
                        .collegeEmail("admin@sys.com")
                        .collegeName("System University")
                        .verificationStatus(VerificationStatus.VERIFIED)
                        .verificationToken(UUID.randomUUID().toString())
                        .tokenExpiryDate(LocalDateTime.now().plusYears(100))
                        .build();

                userRepo.save(adminUser);
                log.info("-----INITIAL ADMIN USER CREATED: admin@gmail.com-----");
            } else {
                log.info("-----INITIAL ADMIN USER ALREADY EXISTS-----");
            }
        };
    }

}
