package com.Agora.Agora.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpoService {

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("CallToPrintStackTrace")
    public void sendNotification(String expoPushToken, String title, String body, Map<String, Object> data) {
        if (expoPushToken == null || !expoPushToken.startsWith("ExponentPushToken"))
            return;

        Map<String, Object> message = new HashMap<>();
        message.put("to", expoPushToken);
        message.put("sound", "default");
        message.put("title", title);
        message.put("body", body);
        if (data != null)
            message.put("data", data);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(List.of(message), headers);

        try {
            restTemplate.postForObject(
                    "https://exp.host/--/api/v2/push/send",
                    request,
                    String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
