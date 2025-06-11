package com.Agora.Agora.Service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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

    public void sendWelcomeEmail(String recipientEmail, String userName, String verificationLink) {
        String subject = "Welcome to Agora, " + userName + "!";
        String text = "Dear  " + userName + ",\n\n"
                + "Welcome aboard Agora! We're excited to have you as a part of our community.\n"
                + "Best Regards,\n"
                + "Agora Team.";
        sendEmail(recipientEmail, subject, text);
    }

    // WE can change this for various other types for ex - listing successfully
    // etc.
    // public void bookingConfirmationEmail(String recipientEmail, Long bookingId,
    // String flightDetails) {
    // String subject = "Your AirVista Booking #" + bookingId + "is Confirmed!";
    // String text = """
    // Dear AirVista Customer,

    // Your booking #""" + bookingId + " has been successfully confirmed.\n"
    // + "Flight Details: " + flightDetails + "\n\n"
    // + "Thank you for choosing AirVista!\n\n"
    // + "Best regards,\n"
    // + "The AirVista Team";
    // sendEmail(recipientEmail, subject, text);
    // }

}
