package com.Agora.Agora.Model;

import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@Builder
@Table(name = "Agora_Users")
@NoArgsConstructor
@AllArgsConstructor
public class AgoraUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User Details
    @Column(unique = true, length = 50)
    private String userName;

    @Column(unique = true, length = 100)
    private String userEmail;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column(unique = true, nullable = false, length = 20)
    private String mobileNumber;

    @Column(length = 255)
    @JsonIgnore
    private String password;

    @Column(length = 255)
    private String profileImage;

    // Role and Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus userStatus;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_blocks",
            joinColumns = @JoinColumn(name = "blocker_id"),
            inverseJoinColumns = @JoinColumn(name = "blocked_id")
    )
    @JsonIgnore
    private Set<AgoraUser> blockedUsers = new HashSet<>();

    @ManyToMany(mappedBy = "blockedUsers")
    @JsonIgnore
    private Set<AgoraUser> blockedByUsers = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    // College Association
    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    // Push Notifications
    @Column(name = "expo_push_token")
    private String expoPushToken;

    // Account Creation
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 1. Auto-delete their Listings
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<Listings> myListings = new ArrayList<>();

    // 2. Auto-delete their Favorites (Likes)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Favorite> myFavorites = new ArrayList<>();

    // 3. Auto-delete Reports they made
    @OneToMany(mappedBy = "reporter", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Report> reportsSubmitted = new ArrayList<>();

    // 4. Auto-delete Reports made against them
    @OneToMany(mappedBy = "reportedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Report> reportsAgainstMe = new ArrayList<>();

    // Helper Methods
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.mobileNumber;
    }

    public String getUserName() {
        return this.userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return UserStatus.ACTIVE.equals(this.userStatus);
    }
}