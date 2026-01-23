package com.Agora.Agora.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

//    @Value("${BREVO_API_KEY}")
//    private String brevoApiKey;

    private final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String to, String subject, String text) {
        sendViaBrevo(to, subject, text, false);
    }

    public void sendWelcomeEmail(String recipientEmail, String userName, String verificationLink) {
        String htmlContent = "<!DOCTYPE html><html lang='en'>...[YOUR LONG WELCOME HTML HERE]...</html>";
        sendViaBrevo(recipientEmail, "🎉 Welcome to Agora, " + userName + "!", htmlContent, true);
    }

    public void sendOtpEmail(String email, String otp) {
        String htmlContent = "<!DOCTYPE html><html lang='en'><body style='margin:0; padding:0; background-color:#F9FAFB; font-family:sans-serif;'>"
                + "<table width='100%' style='background-color:#F9FAFB; padding:40px 20px;'><tr><td align='center'>"
                + "<table width='600' style='background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);'>"
                + "<tr><td style='background:linear-gradient(135deg, #0066CC 0%, #004499 100%); padding:50px 30px; text-align:center;'>"
                + "<div style='color:#ffffff; font-size:38px; font-weight:900; letter-spacing:-1px; margin-bottom:10px;'>Agora</div>"
                + "<h1 style='color:#ffffff; margin:0; font-size:24px; font-weight:700; opacity:0.9;'>Verify Your Account</h1></td></tr>"
                + "<tr><td style='padding:40px 30px;'><p style='color:#111827; font-size:16px; font-weight:600;'>Hello,</p>"
                + "<p style='color:#6B7280; font-size:15px; margin-bottom:40px;'>Use the verification code below to securely sign in.</p>"
                + "<div style='background-color:#F9FAFB; border:2px solid #E5E7EB; border-radius:20px; padding:35px 20px; text-align:center;'>"
                + "<div style='font-size:60px; font-weight:900; color:#0066CC; letter-spacing:14px; font-family:monospace;'>" + otp + "</div></div>"
                + "<p style='color:#9CA3AF; font-size:13px; margin-top:40px; text-align:center;'>Code valid for 10 mins.</p></td></tr>"
                + "</table></td></tr></table></body></html>";

        sendViaBrevo(email, "Your Agora Verification Code", htmlContent, true);
    }

    private void sendViaBrevo(String to, String subject, String content, boolean isHtml) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("sender", Map.of("name", "Agora Support", "email", "spicalabs@gmail.com"));
        requestBody.put("to", List.of(Map.of("email", to)));
        requestBody.put("subject", subject);

        if (isHtml) {
            requestBody.put("htmlContent", content);
        } else {
            requestBody.put("textContent", content);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
       // headers.set("api-key", brevoApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            restTemplate.postForEntity(BREVO_URL, entity, String.class);
            System.out.println("✅ Email sent via Brevo to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Brevo API Error: " + e.getMessage());
        }
    }
}