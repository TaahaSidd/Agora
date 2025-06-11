package com.Agora.Agora.Model;

import java.time.LocalDateTime;

import com.Agora.Agora.Model.Enums.UserRole;
import com.Agora.Agora.Model.Enums.VerificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agora_users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

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

    // College Id and Details.
    @Column(nullable = false)
    private String collegeId;
    @Column(nullable = false)
    private String collegeEmail;
    @Column(nullable = false)
    private String collegeName;

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

}
