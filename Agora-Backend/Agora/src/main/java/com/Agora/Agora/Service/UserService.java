package com.Agora.Agora.Service;

import com.Agora.Agora.Dto.Request.UserReqDto;
import com.Agora.Agora.Dto.Response.UserResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Repository.CollegeRepo;
import com.Agora.Agora.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final CollegeRepo collegeRepo;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dto;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Transactional
    public UserResponseDto addUser(UserReqDto req) {

        if (userRepo.findByUserEmail(req.getUserEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepo.findByUserName(req.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Username already in use.");
        }

        College college = collegeRepo.findById(req.getCollegeId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "College not found with id: " + req.getCollegeId()));

        AgoraUser user = new AgoraUser();
        user.setUserName(req.getUserName());
        user.setUserEmail(req.getUserEmail());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setMobileNumber(req.getMobileNumber());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setCollege(college);
        user.setRole(UserRole.STUDENT);
        user.setVerificationStatus(VerificationStatus.PENDING);
        //user.setVerificationToken(UUID.randomUUID().toString());
        //user.setTokenExpiryDate(LocalDateTime.now().plusHours(24));

        AgoraUser savedUser = userRepo.save(user);

        UserResponseDto responseDto = dto.mapToUserResponseDto(savedUser);
        return responseDto;
    }

    // Getting current User.
    public AgoraUser getCurrentUser() {
        String phoneNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByMobileNumber(phoneNumber)
                .orElseThrow(() -> new UsernameNotFoundException("Phone user not found: " + phoneNumber));
    }


    public UserResponseDto findById(Long id) {
        AgoraUser seller = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("user not found with id " + id));
        UserResponseDto responseDto = dto.mapToUserResponseDto(seller);
        return responseDto;
    }

    public AgoraUser findByEmail(String email) {
        return userRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found " + email));
    }

    @Transactional
    public UserResponseDto updateUser(Long id, UserReqDto req) {
        AgoraUser currentUser = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (req.getUserName() != null)
            currentUser.setUserName(req.getUserName());
        if (req.getFirstName() != null)
            currentUser.setFirstName(req.getFirstName());
        if (req.getLastName() != null)
            currentUser.setLastName(req.getLastName());
        if (req.getUserEmail() != null && !req.getUserEmail().isBlank()) {
            if (!currentUser.getUserEmail().equalsIgnoreCase(req.getUserEmail())) {
                Optional<AgoraUser> userWithEmail = userRepo.findByUserEmail(req.getUserEmail());
                if (userWithEmail.isPresent() && !userWithEmail.get().getId().equals(currentUser.getId())) {
                    throw new IllegalArgumentException(
                            "Email " + req.getUserEmail() + " is already taken by another user");
                }
                currentUser.setUserEmail(req.getUserEmail());
            }
        }
        if (req.getMobileNumber() != null && !req.getMobileNumber().trim().isBlank()) {
            if (!req.getMobileNumber().equals(currentUser.getMobileNumber())) {
                Optional<AgoraUser> userWithMobile = userRepo.findByMobileNumber(req.getMobileNumber());
                if (userWithMobile.isPresent() && !userWithMobile.get().getId().equals(currentUser.getId())) {
                    throw new IllegalArgumentException(
                            "Mobile Number: " + req.getMobileNumber() + " already taken by another user");
                }
                currentUser.setMobileNumber(req.getMobileNumber());
            }
        }

        if (req.getProfileImage() != null && !req.getProfileImage().isBlank()) {
            currentUser.setProfileImage(req.getProfileImage());
        }
        if (req.getCollegeId() != null) {
            College college = collegeRepo.findById(req.getCollegeId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "College not found with id: " + req.getCollegeId()));
            currentUser.setCollege(college);
        }

        AgoraUser savedUser = userRepo.save(currentUser);

        UserResponseDto responseDto = dto.mapToUserResponseDto(savedUser);
        return responseDto;
    }

    @Transactional
    public void banUser(Long userId) {
        AgoraUser user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setUserStatus(UserStatus.BANNED);
        userRepo.save(user);
    }

    @Transactional
    public String updateProfilePicture(String imageUrl) {
        AgoraUser currentUser = getCurrentUser();

        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Image URL cannot be empty");
        }

        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            throw new IllegalArgumentException("Invalid image URL format");
        }

        log.info("Updating profile picture for userId={}", currentUser.getId());

        currentUser.setProfileImage(imageUrl);
        userRepo.save(currentUser);

        log.info("✅ Profile picture updated for userId={}: {}", currentUser.getId(), imageUrl);

        return imageUrl;
    }
}
