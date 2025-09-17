package com.Agora.Agora.Jwt;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class BlackListService {
    private final Set<String> blackListedTokens = Collections.synchronizedSet(new HashSet<>());

    public void blackListedToken(String token) {
        blackListedTokens.add(token);
        System.out.println("Token Backlisted: " + token);
    }

    public boolean isTokenBlackListed(String token) {
        return blackListedTokens.contains(token);
    }

    public void removeTokensFromBlackList(String token) {
        blackListedTokens.remove(token);
        System.out.println("Token removed from backlist");
    }
}
