package com.Agora.Agora.Service;

import java.io.UnsupportedEncodingException;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            javaMailSender.send(message);
            System.out.println("Email Sent Successfully to: " + to + "with subject: " + subject);
        } catch (MailException e) {
            System.out.println("Failed to send email to: " + to + "with subject: " + subject);
        }
    }

    @SuppressWarnings("CallToPrintStackTrace")
    public void sendWelcomeEmail(String recipientEmail, String userName, String verificationLink)
            throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlContent = "<!DOCTYPE html>"
                + "<html lang='en'>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<title>Welcome to Agora</title>"
                + "</head>"
                + "<body style='margin:0; padding:0; background-color:#F9FAFB; font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;'>"

                // Main Container
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#F9FAFB; padding:40px 20px;'>"
                + "<tr><td align='center'>"

                // Email Card
                + "<table width='600' cellpadding='0' cellspacing='0' border='0' style='background-color:#ffffff; border-radius:24px; box-shadow:0 4px 6px rgba(0,0,0,0.05); overflow:hidden;'>"

                // Header with Logo and Welcome Banner
                + "<tr>"
                + "<td style='background:linear-gradient(135deg, "
                + " 0%, #0066CC 100%); padding:50px 30px; text-align:center;'>"
                + "<img src='http://localhost:9000/images/Logo-app.jpg' alt='Agora Logo' style='width:100px; height:100px; border-radius:24px; margin-bottom:20px; border:4px solid rgba(255,255,255,0.3);' />"
                + "<h1 style='color:#ffffff; margin:0 0 8px 0; font-size:32px; font-weight:800; letter-spacing:-0.5px;'>Welcome to Agora! 🎉</h1>"
                + "<p style='color:rgba(255,255,255,0.9); font-size:16px; margin:0; font-weight:500;'>Your Campus Marketplace Awaits</p>"
                + "</td>"
                + "</tr>"

                // Content Section
                + "<tr>"
                + "<td style='padding:40px 30px;'>"

                // Personalized Greeting
                + "<p style='color:#111827; font-size:18px; font-weight:700; margin:0 0 16px 0;'>"
                + "Hi " + userName + ",</p>"

                + "<p style='color:#6B7280; font-size:15px; margin:0 0 24px 0; line-height:1.6;'>"
                + "Welcome aboard! We're thrilled to have you join our growing community of students buying, selling, and trading on campus.</p>"

                // What's Next Section
                + "<div style='background-color:#F9FAFB; border-radius:16px; padding:24px; margin-bottom:32px;'>"
                + "<h2 style='color:#111827; font-size:18px; font-weight:800; margin:0 0 20px 0; letter-spacing:-0.3px;'>🚀 Get Started in 3 Easy Steps</h2>"

                // Step 1
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:16px;'>"
                + "<tr>"
                + "<td style='width:44px; vertical-align:top;'>"
                + "<div style='width:44px; height:44px; background-color:#DBEAFE; border-radius:22px; display:flex; align-items:center; justify-content:center; color:#2563EB; font-size:18px; font-weight:800;'>1</div>"
                + "</td>"
                + "<td style='padding-left:16px; vertical-align:top;'>"
                + "<p style='color:#111827; font-size:15px; font-weight:700; margin:0 0 4px 0;'>Complete Your Profile</p>"
                + "<p style='color:#6B7280; font-size:14px; margin:0; line-height:1.5;'>Add a profile photo and bio to build trust with buyers and sellers.</p>"
                + "</td>"
                + "</tr>"
                + "</table>"

                // Step 2
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:16px;'>"
                + "<tr>"
                + "<td style='width:44px; vertical-align:top;'>"
                + "<div style='width:44px; height:44px; background-color:#D1FAE5; border-radius:22px; display:flex; align-items:center; justify-content:center; color:#10B981; font-size:18px; font-weight:800;'>2</div>"
                + "</td>"
                + "<td style='padding-left:16px; vertical-align:top;'>"
                + "<p style='color:#111827; font-size:15px; font-weight:700; margin:0 0 4px 0;'>Browse Listings</p>"
                + "<p style='color:#6B7280; font-size:14px; margin:0; line-height:1.5;'>Explore items from fellow students in your college community.</p>"
                + "</td>"
                + "</tr>"
                + "</table>"

                // Step 3
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0'>"
                + "<tr>"
                + "<td style='width:44px; vertical-align:top;'>"
                + "<div style='width:44px; height:44px; background-color:#FCE7F3; border-radius:22px; display:flex; align-items:center; justify-content:center; color:#EC4899; font-size:18px; font-weight:800;'>3</div>"
                + "</td>"
                + "<td style='padding-left:16px; vertical-align:top;'>"
                + "<p style='color:#111827; font-size:15px; font-weight:700; margin:0 0 4px 0;'>Start Trading</p>"
                + "<p style='color:#6B7280; font-size:14px; margin:0; line-height:1.5;'>List your items or message sellers to make your first deal!</p>"
                + "</td>"
                + "</tr>"
                + "</table>"
                + "</div>"

                // Verification Button (if link provided)
                + (verificationLink != null && !verificationLink.isEmpty()
                        ? "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:32px;'>"
                                + "<tr><td align='center'>"
                                + "<a href='" + verificationLink + "' style='display:inline-block; background-color:"
                                + "; color:#ffffff; text-decoration:none; padding:16px 32px; border-radius:14px; font-size:15px; font-weight:700; box-shadow:0 4px 8px rgba(0, 140, 254, 0.3);'>✓ Verify Your Email</a>"
                                + "<p style='color:#9CA3AF; font-size:13px; margin:12px 0 0 0;'>Verify your email to unlock all features</p>"
                                + "</td></tr>"
                                + "</table>"
                        : "")

                // Features Grid
                + "<h3 style='color:#111827; font-size:16px; font-weight:800; margin:0 0 16px 0; letter-spacing:-0.3px;'>What You Can Do on Agora:</h3>"
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:32px;'>"
                + "<tr>"

                // Feature 1
                + "<td width='50%' style='padding:12px;'>"
                + "<div style='background-color:#FEF3C7; border-radius:12px; padding:16px; text-align:center; height:100%;'>"
                + "<div style='font-size:32px; margin-bottom:8px;'>🛒</div>"
                + "<p style='color:#92400E; font-size:14px; font-weight:700; margin:0 0 4px 0;'>Buy & Sell</p>"
                + "<p style='color:#78350F; font-size:12px; margin:0; line-height:1.4;'>Trade textbooks, electronics, and more</p>"
                + "</div>"
                + "</td>"

                // Feature 2
                + "<td width='50%' style='padding:12px;'>"
                + "<div style='background-color:#E0E7FF; border-radius:12px; padding:16px; text-align:center; height:100%;'>"
                + "<div style='font-size:32px; margin-bottom:8px;'>💬</div>"
                + "<p style='color:#3730A3; font-size:14px; font-weight:700; margin:0 0 4px 0;'>Chat Safely</p>"
                + "<p style='color:#4338CA; font-size:12px; margin:0; line-height:1.4;'>Message sellers securely in-app</p>"
                + "</div>"
                + "</td>"

                + "</tr>"
                + "<tr>"

                // Feature 3
                + "<td width='50%' style='padding:12px;'>"
                + "<div style='background-color:#FEE2E2; border-radius:12px; padding:16px; text-align:center; height:100%;'>"
                + "<div style='font-size:32px; margin-bottom:8px;'>❤️</div>"
                + "<p style='color:#991B1B; font-size:14px; font-weight:700; margin:0 0 4px 0;'>Save Favorites</p>"
                + "<p style='color:#B91C1C; font-size:12px; margin:0; line-height:1.4;'>Keep track of items you love</p>"
                + "</div>"
                + "</td>"

                // Feature 4
                + "<td width='50%' style='padding:12px;'>"
                + "<div style='background-color:#D1FAE5; border-radius:12px; padding:16px; text-align:center; height:100%;'>"
                + "<div style='font-size:32px; margin-bottom:8px;'>🎓</div>"
                + "<p style='color:#065F46; font-size:14px; font-weight:700; margin:0 0 4px 0;'>Campus Only</p>"
                + "<p style='color:#047857; font-size:12px; margin:0; line-height:1.4;'>Connect with your college community</p>"
                + "</div>"
                + "</td>"

                + "</tr>"
                + "</table>"

                // Support Section
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#DBEAFE; border-radius:12px; padding:20px; margin-bottom:32px;'>"
                + "<tr>"
                + "<td style='width:40px; vertical-align:top; padding-right:12px;'>"
                + "<div style='width:32px; height:32px; background-color:#3B82F6; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:18px;'>💡</div>"
                + "</td>"
                + "<td>"
                + "<p style='color:#1E40AF; font-size:14px; font-weight:700; margin:0 0 4px 0;'>Need Help Getting Started?</p>"
                + "<p style='color:#1E3A8A; font-size:13px; margin:0 0 12px 0; line-height:1.5;'>Check out our FAQ section or reach out to our support team anytime.</p>"
                + "<a href='#' style='color:#2563EB; font-size:13px; font-weight:700; text-decoration:none;'>Visit Help Center →</a>"
                + "</td>"
                + "</tr>"
                + "</table>"

                // Divider
                + "<div style='height:1px; background-color:#E5E7EB; margin:32px 0;'></div>"

                // Closing
                + "<p style='color:#6B7280; font-size:14px; margin:0 0 8px 0; line-height:1.6;'>"
                + "Thanks for joining us, and happy trading!</p>"

                + "<p style='color:#111827; font-size:15px; font-weight:700; margin:0;'>"
                + "The Agora Team 🚀</p>"

                + "</td>"
                + "</tr>"

                // Footer
                + "<tr>"
                + "<td style='background-color:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;'>"
                + "<div style='margin-bottom:16px;'>"
                + "<a href='#' style='display:inline-block; margin:0 8px;'>"
                + "<img src='http://localhost:9000/images/facebook-icon.png' alt='Facebook' style='width:24px; height:24px;' />"
                + "</a>"
                + "<a href='#' style='display:inline-block; margin:0 8px;'>"
                + "<img src='http://localhost:9000/images/twitter-icon.png' alt='Twitter' style='width:24px; height:24px;' />"
                + "</a>"
                + "<a href='#' style='display:inline-block; margin:0 8px;'>"
                + "<img src='http://localhost:9000/images/instagram-icon.png' alt='Instagram' style='width:24px; height:24px;' />"
                + "</a>"
                + "</div>"
                + "<p style='color:#9CA3AF; font-size:13px; margin:0 0 16px 0;'>Your Campus Marketplace</p>"
                + "<div style='margin-top:16px;'>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Help Center</a>"
                + "<span style='color:#D1D5DB;'>|</span>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Privacy Policy</a>"
                + "<span style='color:#D1D5DB;'>|</span>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Terms of Service</a>"
                + "</div>"
                + "<p style='color:#D1D5DB; font-size:11px; margin:20px 0 0 0;'>"
                + "© 2025 Agora. All rights reserved."
                + "</p>"
                + "<p style='color:#D1D5DB; font-size:11px; margin:8px 0 0 0;'>"
                + "You're receiving this email because you signed up for Agora."
                + "</p>"
                + "</td>"
                + "</tr>"

                + "</table>"
                + "</td></tr>"
                + "</table>"

                + "</body>"
                + "</html>";

        helper.setTo(recipientEmail);
        helper.setSubject("🎉 Welcome to Agora, " + userName + "!");
        helper.setText(htmlContent, true);
        try {
            helper.setFrom("noreply@agora.com", "Agora");
        } catch (UnsupportedEncodingException | MessagingException e) {
            e.printStackTrace();
        }

        javaMailSender.send(mimeMessage);
    }

    @SuppressWarnings("CallToPrintStackTrace")
    public void sendOtpEmail(String email, String otp) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlContent = "</html>"
                + "<!DOCTYPE html>"
                + "<html lang='en'>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<title>Password Reset OTP</title>"
                + "</head>"
                + "<body style='margin:0; padding:0; background-color:#F9FAFB; font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;'>"

                // Main Container
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#F9FAFB; padding:40px 20px;'>"
                + "<tr><td align='center'>"

                // Email Card
                + "<table width='600' cellpadding='0' cellspacing='0' border='0' style='background-color:#ffffff; border-radius:24px; box-shadow:0 4px 6px rgba(0,0,0,0.05); overflow:hidden;'>"

                // Header with Logo
                + "<tr>"
                + "<td style='background:linear-gradient(135deg, "
                + " 0%, #0066CC 100%); padding:40px 30px; text-align:center;'>"
                + "<img src='http://localhost:9000/images/Logo-app.jpg' alt='Agora Logo' style='width:80px; height:80px; border-radius:20px; margin-bottom:16px; border:4px solid rgba(255,255,255,0.2);' />"
                + "<h1 style='color:#ffffff; margin:0; font-size:28px; font-weight:800; letter-spacing:-0.5px;'>Password Reset</h1>"
                + "</td>"
                + "</tr>"

                // Content Section
                + "<tr>"
                + "<td style='padding:40px 30px;'>"

                // Greeting
                + "<p style='color:#111827; font-size:16px; font-weight:600; margin:0 0 24px 0; line-height:1.5;'>"
                + "Hello,</p>"

                + "<p style='color:#6B7280; font-size:15px; margin:0 0 32px 0; line-height:1.6;'>"
                + "We received a request to reset your password. Use the verification code below to complete the process:</p>"

                // OTP Box
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='margin-bottom:32px;'>"
                + "<tr><td align='center'>"
                + "<div style='background-color:#F9FAFB; border:2px dashed #E5E7EB; border-radius:16px; padding:24px; display:inline-block;'>"
                + "<p style='color:#6B7280; font-size:13px; font-weight:700; margin:0 0 8px 0; text-transform:uppercase; letter-spacing:0.5px;'>Your Verification Code</p>"
                + "<div style='font-size:36px; font-weight:800; color:"
                + "; letter-spacing:8px; font-family:\"Courier New\", monospace;'>"
                + otp
                + "</div>"
                + "</div>"
                + "</td></tr>"
                + "</table>"

                // Time validity info
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#FEF3C7; border-radius:12px; padding:16px; margin-bottom:32px;'>"
                + "<tr>"
                + "<td style='width:40px; vertical-align:top; padding-right:12px;'>"
                + "<div style='width:32px; height:32px; background-color:#F59E0B; border-radius:16px; display:flex; align-items:center; justify-content:center;'>"
                + "⏱️"
                + "</div>"
                + "</td>"
                + "<td>"
                + "<p style='color:#92400E; font-size:14px; font-weight:600; margin:0 0 4px 0;'>Time Sensitive</p>"
                + "<p style='color:#78350F; font-size:13px; margin:0; line-height:1.5;'>This code will expire in <strong>10 minutes</strong>.</p>"
                + "</td>"
                + "</tr>"
                + "</table>"

                // Security notice
                + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#DBEAFE; border-radius:12px; padding:16px; margin-bottom:32px;'>"
                + "<tr>"
                + "<td style='width:40px; vertical-align:top; padding-right:12px;'>"
                + "<div style='width:32px; height:32px; background-color:#3B82F6; border-radius:16px; display:flex; align-items:center; justify-content:center;'>"
                + "</div>"
                + "</td>"
                + "<td>"
                + "<p style='color:#1E40AF; font-size:14px; font-weight:600; margin:0 0 4px 0;'>Security Tip</p>"
                + "<p style='color:#1E3A8A; font-size:13px; margin:0; line-height:1.5;'>Never share this code with anyone.</p>"
                + "</td>"
                + "</tr>"
                + "</table>"

                // Divider
                + "<div style='height:1px; background-color:#E5E7EB; margin:32px 0;'></div>"

                // Didn't request section
                + "<p style='color:#6B7280; font-size:14px; margin:0 0 8px 0; line-height:1.6;'>"
                + "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>"

                + "<p style='color:#9CA3AF; font-size:13px; margin:0; line-height:1.6;'>"
                + "This is an automated message, please do not reply to this email.</p>"

                + "</td>"
                + "</tr>"

                // Footer
                + "<tr>"
                + "<td style='background-color:#F9FAFB; padding:30px; text-align:center; border-top:1px solid #E5E7EB;'>"
                + "<p style='color:#111827; font-size:15px; font-weight:700; margin:0 0 8px 0;'>The Agora Team</p>"
                + "<p style='color:#9CA3AF; font-size:13px; margin:0 0 16px 0;'>Your Campus Marketplace</p>"
                + "<div style='margin-top:20px;'>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Help Center</a>"
                + "<span style='color:#D1D5DB;'>|</span>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Privacy Policy</a>"
                + "<span style='color:#D1D5DB;'>|</span>"
                + "<a href='#' style='color:#6B7280; text-decoration:none; font-size:12px; margin:0 8px;'>Contact Us</a>"
                + "</div>"
                + "<p style='color:#D1D5DB; font-size:11px; margin:20px 0 0 0;'>"
                + "© 2025 Agora. All rights reserved."
                + "</p>"
                + "</td>"
                + "</tr>"

                + "</table>"
                + "</td></tr>"
                + "</table>"

                + "</body>";

        helper.setTo(email);
        helper.setSubject("Your Agora Password Reset Code");
        helper.setText(htmlContent, true);
        try {
            helper.setFrom("noreply@agora.com", "Agora");
        } catch (UnsupportedEncodingException | MessagingException e) {
            e.printStackTrace();
        }

        javaMailSender.send(mimeMessage);
    }
}
