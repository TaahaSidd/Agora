# Agora — Student Marketplace App
A student-focused marketplace designed for college communities, enabling safe and structured buying, selling, and service exchange.

<img width="1823" height="1186" alt="Github" src="https://github.com/user-attachments/assets/65423c51-5b21-4510-bd98-24a12bdb8679" />
 
<img width="1501" height="733" alt="Billboards" src="https://github.com/user-attachments/assets/c7603727-711d-41b4-a35b-0b92fd9bc5c1" />

# Project Overview
Agora is a mobile marketplace application built to help college students buy, sell, rent, and exchange items and services within their academic communities.
It replaces fragmented WhatsApp and Telegram groups with a structured, campus-aware platform focused on relevance, trust, and usability.

The app is designed with real-world moderation, access control, and scalability considerations, and is currently being prepared for a Google Play Store release.

# Problem
Students commonly rely on informal channels like group chats to trade books, electronics, and services. These platforms lack:
- structured discovery
- moderation and safety controls
- reliable user accountability
-relevance filtering by college or campus
As a result, listings get buried, trust is low, and transactions are inefficient.

# Solution
Agora provides a dedicated, student-focused marketplace where:
- users interact within college-based contexts
- listings are structured and discoverable
- communication happens inside the platform
- basic trust and moderation mechanisms are built in
Rather than competing with general marketplaces, Agora narrows the audience to increase usefulness and reliability.


# Core Features (MVP)
- User & Access Management
- Phone number–based authentication
- Mandatory college selection from an approved list
- Role-based access (student, admin/moderation)
- User profiles with listing history

# Listings
- Item and service listings (books, electronics, furniture, tutoring, etc.)
- Multiple images, pricing, categories, and conditions
- College-scoped visibility to keep content relevant

# Discovery
- Keyword search
- Category and price filters
- Sorting by recency and price

# In-App Communication
- Direct buyer–seller chat linked to listings
- Push notifications for messages and listing activity

# Trust & Safety
- User blocking
- Reporting of users and listings
- Admin moderation tools for enforcement actions

# Trust & Safety Design
- Agora does not rely on heavy identity verification in its initial version. Instead, it combines:
- phone verification
- college-based access control
- scoped visibility
- community reporting
- moderation tooling
Stronger verification layers (e.g., college email badges) are planned as the platform scales.

# Technology Stack
- Backend: Spring Boot (Java)
- Database: PostgreSQL (Dockerized)
- Authentication: Firebase
- Image Storage: Cloudinary
- Notifications: Firebase Cloud Messaging
- Mobile App: React Native (Expo)

# Vision
To create a vibrant, safe, and efficient peer-to-peer marketplace that empowers college students to easily exchange goods and services, fostering a more connected and sustainable campus environment.

