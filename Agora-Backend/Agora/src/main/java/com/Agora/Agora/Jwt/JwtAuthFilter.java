package com.Agora.Agora.Jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final BlackListService blackListService;
    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    @Override
    @SuppressWarnings("UseSpecificCatch")
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        log.debug("➡️ Incoming request: {}", request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in Authorization header.");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtTokenProvider.extractUsername(jwt);
            log.debug("Extracted username from token: {}", userEmail);
        } catch (Exception e) {
            log.error("Failed to extract username from token: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }
        if (blackListService.isTokenBlackListed(jwt)) {
            log.warn("Blocked blacklisted token for user: {}", userEmail);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token has been invalidated.");
            return;
        }
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            log.debug("Loaded UserDetails for {} with authorities: {}", userEmail, userDetails.getAuthorities());

            boolean isValid = jwtTokenProvider.isTokenValid(jwt, userDetails);
            log.debug("Token validity for {} -> {}", userEmail, isValid);

            if (isValid) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Authentication set in context for user: {}", userEmail);
                log.info("User Authorities: {}", userDetails.getAuthorities());
            } else {
                log.warn("Invalid or expired token for user: {}", userEmail);
            }
        } else {
            log.debug("Skipped authentication setup (already authenticated or no username).");
        }

        log.info("Filter chain continuing for URL: {} | Authenticated user: {} | Authorities: {}",
                request.getRequestURI(),
                SecurityContextHolder.getContext().getAuthentication() != null
                        ? SecurityContextHolder.getContext().getAuthentication().getName()
                        : "NONE",
                SecurityContextHolder.getContext().getAuthentication() != null
                        ? SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                        : "NONE");
        filterChain.doFilter(request, response);
    }

}
