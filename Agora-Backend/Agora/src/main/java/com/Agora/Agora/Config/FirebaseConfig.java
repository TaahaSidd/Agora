package com.Agora.Agora.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    public FirebaseConfig() {
        log.info("🔧 FirebaseConfig constructor called");
        System.out.println("🔧 FirebaseConfig constructor called");
    }

    @PostConstruct
    public void init() {
        log.info("🔥 @PostConstruct init() method called");
        System.out.println("🔥 @PostConstruct init() method called");

        try {
            if (FirebaseApp.getApps().isEmpty()) {
                log.info("🔥 Initializing Firebase Admin SDK...");
                System.out.println("🔥 Initializing Firebase Admin SDK...");

                String firebaseCredentials = System.getenv("FIREBASE_CREDENTIALS");

                if (firebaseCredentials == null || firebaseCredentials.isEmpty()) {
                    log.error("❌ FIREBASE_CREDENTIALS not found!");
                    System.err.println("❌ FIREBASE_CREDENTIALS not found!");
                    throw new IllegalStateException("FIREBASE_CREDENTIALS environment variable is not set");
                }

                log.info("✅ FIREBASE_CREDENTIALS found, length: {}", firebaseCredentials.length());
                System.out.println("✅ FIREBASE_CREDENTIALS found, length: " + firebaseCredentials.length());

                InputStream serviceAccount = new ByteArrayInputStream(
                        firebaseCredentials.getBytes(StandardCharsets.UTF_8)
                );

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);

                log.info("✅ Firebase Admin SDK initialized successfully!");
                System.out.println("✅ Firebase Admin SDK initialized successfully!");
            } else {
                log.info("ℹ️ Firebase already initialized");
                System.out.println("ℹ️ Firebase already initialized");
            }
        } catch (Exception e) {
            log.error("❌ Firebase initialization failed: {}", e.getMessage(), e);
            System.err.println("❌ Firebase initialization failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Firebase", e);
        }
    }
}