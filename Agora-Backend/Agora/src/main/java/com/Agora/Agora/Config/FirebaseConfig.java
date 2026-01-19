package com.Agora.Agora.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.*;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            String base64Config = System.getenv("FIREBASE_JSON_BASE64");
            InputStream serviceAccount;

            if (base64Config != null && !base64Config.isEmpty()) {
                // 🚀 PRODUCTION: Use the Base64 variable from Render
                System.out.println("✅ Firebase: Initializing from Render Env Var");
                byte[] decodedBytes = java.util.Base64.getDecoder().decode(base64Config);
                serviceAccount = new ByteArrayInputStream(decodedBytes);
            } else {
                // 💻 LOCAL: Fallback to your PC's local file
                System.out.println("💻 Firebase: Env Var not found, checking local path...");
                serviceAccount = getClass().getClassLoader()
                        .getResourceAsStream("agoraapp-e84de-firebase-adminsdk-fbsvc-48f429f78e.json");
            }

            if (serviceAccount == null) {
                throw new RuntimeException("❌ ERROR: Firebase credentials NOT FOUND!");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("🚀 Firebase [DEFAULT] initialized successfully!");
        }
        return FirebaseAuth.getInstance();
    }
}