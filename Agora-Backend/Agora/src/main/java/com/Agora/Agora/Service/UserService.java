package com.Agora.Agora.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.UserReqDto;
import com.Agora.Agora.Dto.Response.UserResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Repository.CollegeRepo;
import com.Agora.Agora.Repository.UserRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final CollegeRepo collegeRepo;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper dto;

    // Method to add user. by admin
    @Transactional
    public UserResponseDto addUser(UserReqDto req) {

        if (userRepo.findByUserEmail(req.getUserEmail()).isPresent()) { // Use isPresent() for Optional
            throw new RuntimeException("Email already exists");
        }

        if (userRepo.findByUserName(req.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Username already in use.");
        }

        College college = collegeRepo.findById(req.getCollegeId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "College not found with id: " + req.getCollegeId()));

        // Build the new User entity
        AgoraUser user = new AgoraUser();
        user.setUserName(req.getUserName());
        user.setUserEmail(req.getUserEmail());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setMobileNumber(req.getMobileNumber());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setIdCardNo(req.getIdCardNo());
        user.setCollege(college); // Set the College relationship
        user.setRole(UserRole.STUDENT);
        user.setVerificationStatus(VerificationStatus.PENDING_EMAIL);
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setTokenExpiryDate(LocalDateTime.now().plusHours(24));

        AgoraUser savedUser = userRepo.save(user);

        UserResponseDto responseDto = dto.mapToUserResponseDto(savedUser);
        return responseDto;
    }

    // Getting current User.
    public AgoraUser getCurrentUser() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUserEmail(userName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + userName));
    }

    // Updating users both by admin and authenticated user.
    @Transactional
    public UserResponseDto updateUser(Long id, UserReqDto req) {
        AgoraUser currentUser = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // User Details.
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

        // College details - only update the relationship if collegeId is present
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
        user.setUserStatus(UserStatus.BANNED); // Assuming you have a UserStatus enum with BANNED
        userRepo.save(user);
    }
}
