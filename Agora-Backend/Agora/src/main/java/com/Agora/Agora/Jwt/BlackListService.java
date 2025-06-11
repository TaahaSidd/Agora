package com.Agora.Agora.Jwt;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class BlackListService {
    private final Set<String> blackListedTokens = Collections.synchronizedSet(new HashSet<>());

    /**
     * Adds a token to the blacklist.
     *
     * @param token The JWT token to blacklist.
     */
    public void blackListedToken(String token) {
        blackListedTokens.add(token);
        System.out.println("Token Backlisted: " + token);
    }

    /**
     * Checks if a token is in the blacklist.
     *
     * @param token The JWT token to check.
     * @return true if the token is blacklisted, false otherwise.
     */
    public boolean isTokenBlackListed(String token) {
        return blackListedTokens.contains(token);
    }

    /**
     * Optional: Remove token from blacklist after its natural expiration.
     * For in-memory, this is less critical, but important for persistent stores.
     * In a real system, you'd typically add logic here to expire tokens
     * from the blacklist after their JWT's expiration time + a small buffer.
     *
     * @param token The token to remove from the blacklist.
     */
    public void removeTokensFromBlackList(String token) {
        blackListedTokens.remove(token);
        System.out.println("Token removed from backlist");
    }
}
