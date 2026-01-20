package com.Agora.Agora.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private AgoraUser follower;

    @ManyToOne
    @JsonIgnore
    private AgoraUser following;

    private LocalDateTime followedAt = LocalDateTime.now();

    public Follow(AgoraUser follower, AgoraUser following) {
        this.follower = follower;
        this.following = following;
        this.followedAt = LocalDateTime.now();
    }
}
