package com.Agora.Agora.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.Agora.Agora.Jwt.JwtAuthFilter;
import com.Agora.Agora.Service.CustomUserDetailService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailService customUserDetailsService;

    @Bean
    @SuppressWarnings("unused")
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        // Auth endpoints (public)
                        .requestMatchers(HttpMethod.POST, "/Agora/auth/**").permitAll()

                        // Listing.
                        .requestMatchers(HttpMethod.POST, "/Agora/listing/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/Agora/listing/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/Agora/listing/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/Agora/listing/**").authenticated()

                        // Profile.
                        .requestMatchers(HttpMethod.GET, "/Agora/profile/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/Agora/profile/**").authenticated()

                        // ChatRoom
                        .requestMatchers(HttpMethod.POST, "/Agora/ChatRoom/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/Agora/ChatRoom/**").authenticated()

                        // College - Admin only.
                        .requestMatchers(HttpMethod.POST, "/Agora/college/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/Agora/college/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/Agora/college/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/Agora/college/**").authenticated()

                )

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    @SuppressWarnings("unused")
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
