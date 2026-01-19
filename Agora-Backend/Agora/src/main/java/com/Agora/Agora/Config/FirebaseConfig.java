package com.Agora.Agora.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.File;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount;

                File renderSecret = new File("firebase-key.json");

                if (renderSecret.exists()) {
                    serviceAccount = new FileInputStream(renderSecret);
                    System.out.println("🚀 Initializing Firebase with Render Secret File...");
                } else {

                    serviceAccount = new FileInputStream("src/main/resources/agoraapp-e84de-firebase-adminsdk-fbsvc-48f429f78e.json");
                    System.out.println("💻 Initializing Firebase with local JSON file...");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("✅ Firebase is ready!");
            }
        } catch (IOException e) {
            System.err.println("❌ Firebase init failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}