package com.Agora.Agora.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private AgoraUser follower;

    @ManyToOne
    private AgoraUser following;

    private LocalDateTime followedAt = LocalDateTime.now();

    public Follow(AgoraUser follower, AgoraUser following) {
        this.follower = follower;
        this.following = following;
        this.followedAt = LocalDateTime.now();
    }
}
