package com.Agora.Agora.Model;

import java.time.LocalDateTime;

import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.UserStatus;
import com.Agora.Agora.Model.Enums.VerificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "Agora_Users")
@NoArgsConstructor
@AllArgsConstructor
public class AgoraUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User Details.
    @Column(unique = true, nullable = false, length = 50)
    private String userName;
    @Column(unique = true, nullable = false, length = 100)
    private String userEmail;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(unique = true, nullable = false, length = 20)
    private String mobileNumber;
    @Column(nullable = false, length = 255)
    private String password;
    @Column(nullable = false)
    private String idCardNo; // will be adding college id images url. will be using cloudinary for that.

    // Role = Student.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // Mandatory.
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @Column(nullable = false)
    private String verificationToken;

    @Column(nullable = false)
    private LocalDateTime tokenExpiryDate;// Token Expiry Date.

    @ManyToOne(optional = false)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus userStatus;

    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }
}
