package com.Agora.Agora.InitialAdminCreator;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Repository.CollegeRepo;
import com.Agora.Agora.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class InitialAdmin {

    private static final Logger log = LoggerFactory.getLogger(InitialAdmin.class);

    private final UserRepo userRepo;
    private final CollegeRepo collegeRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @SuppressWarnings("unused")
    CommandLineRunner createAdmin() {
        return args -> {

            if (userRepo.findByUserEmail("admin@gmail.com").isEmpty()) {
                log.info("Creating Initial Admin User...");

                College college = collegeRepo.findById(1L)
                        .orElseGet(() -> collegeRepo.save(
                                College.builder()
                                        .collegeName("Default Admin College")
                                        .collegeEmail("admincollege@example.com")
                                        .address("Admin Address")
                                        .city("Admin City")
                                        .state("Admin State")
                                        .country("Admin Country")
                                        .website("https://admincollege.example.com")
                                        .build()));

                AgoraUser adminUser = AgoraUser.builder()
                        .userName("Admin")
                        .firstName("System")
                        .lastName("Admin")
                        .userEmail("admin@gmail.com")
                        .mobileNumber("1234598760")
                        .password(passwordEncoder.encode("ADMINPASSWORD"))
                        .role(UserRole.ADMIN)
                        .idCardNo("testIdCardno")
                        .college(college)
                        .userStatus(UserStatus.ACTIVE)
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
