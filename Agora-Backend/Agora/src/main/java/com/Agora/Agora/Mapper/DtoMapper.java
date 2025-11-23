package com.Agora.Agora.Mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.Agora.Agora.Dto.Request.ReportResolveReqDto;
import com.Agora.Agora.Dto.Response.ChatRoomResponseDto;
import com.Agora.Agora.Dto.Response.CollegeResponseDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Dto.Response.MessageResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
import com.Agora.Agora.Dto.Response.ReportResolveResponse;
import com.Agora.Agora.Dto.Response.ReportResponseDto;
import com.Agora.Agora.Dto.Response.ReviewResponse;
import com.Agora.Agora.Dto.Response.UserResponseDto;
import com.Agora.Agora.Model.AgoraUser;
import com.Agora.Agora.Model.ChatRoom;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.ListingImage;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.Message;
import com.Agora.Agora.Model.Report;
import com.Agora.Agora.Model.Review;
import com.Agora.Agora.Service.MessageService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DtoMapper {

    private final MessageService messageService;

    // Dto mapping for User.
    public UserResponseDto mapToUserResponseDto(AgoraUser user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUserName(user.getUsername());
        dto.setUserEmail(user.getUserEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setIdCardNo(user.getIdCardNo());
        dto.setProfileImage(user.getProfileImage());
        dto.setVerificationStatus(user.getVerificationStatus());

        // Set college details
        if (user.getCollege() != null) {
            dto.setCollegeId(user.getCollege().getId());
            dto.setCollegeName(user.getCollege().getCollegeName());
            dto.setCollegeEmail(user.getCollege().getCollegeEmail());
        }

        return dto;
    }

    // Dto mapper for Registration.
    public RegistrationResponseDto mapToRegistrationResponseDto(AgoraUser user) {
        RegistrationResponseDto dto = new RegistrationResponseDto();
        dto.setId(user.getId());
        dto.setUserName(user.getUsername());
        dto.setUserEmail(user.getUserEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setIdCardNo(user.getIdCardNo());
        dto.setProfileImage(user.getProfileImage());
        dto.setVerificationStatus(user.getVerificationStatus());

        // Set college details
        if (user.getCollege() != null) {
            dto.setCollegeId(user.getCollege().getId());
            dto.setCollegeName(user.getCollege().getCollegeName());
            dto.setCollegeEmail(user.getCollege().getCollegeEmail());
        }

        return dto;
    }

    // Dto mapping for College
    public CollegeResponseDto mapToCollegeResponseDto(College college) {
        CollegeResponseDto dto = new CollegeResponseDto();
        dto.setId(college.getId());
        dto.setCollegeName(college.getCollegeName());
        dto.setCollegeEmail(college.getCollegeEmail());
        dto.setAddress(college.getAddress());
        dto.setCity(college.getCity());
        dto.setState(college.getState());
        dto.setCountry(college.getCountry());
        dto.setWebsite(college.getWebsite());

        dto.setLatitude(college.getLatitude());
        dto.setLongitude(college.getLongitude());

        return dto;
    }

    // Dto mapper for Listing.
    public ListingResponseDto mapToListingResponseDto(Listings listing) {
        ListingResponseDto dto = new ListingResponseDto();
        dto.setId(listing.getId());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setPrice(listing.getPrice());
        dto.setCategory(listing.getCategory());
        dto.setPostDate(listing.getPostDate());
        dto.setItemCondition(listing.getItemCondition());
        dto.setItemStatus(listing.getItemStatus());
        dto.setImageUrl(
                listing.getImages().stream()
                        .map(ListingImage::getUrl)
                        .collect(Collectors.toList()));

        dto.setSeller(mapToUserResponseDto(listing.getSeller()));
        if (listing.getSeller() != null && listing.getSeller().getCollege() != null) {
            dto.setCollege(mapToCollegeResponseDto(listing.getSeller().getCollege()));
        }
        return dto;
    }

    // Dto mapper for ChatRoom
    public ChatRoomResponseDto mapToChatRoomResponseDto(ChatRoom chatRoom, AgoraUser currentUser) {
        ChatRoomResponseDto dto = new ChatRoomResponseDto();
        dto.setId(chatRoom.getId());
        dto.setListingId(chatRoom.getListing().getId());
        dto.setSellerId(chatRoom.getSeller().getId());
        dto.setBuyerId(chatRoom.getBuyer().getId());
        dto.setListingTitle(chatRoom.getListing().getTitle());
        dto.setBuyerUserName(chatRoom.getBuyer().getUsername());
        dto.setSellerUserName(chatRoom.getSeller().getUsername());
        dto.setLastMessageAt(chatRoom.getLastMessageAt());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setLastMessageAt(chatRoom.getLastMessageAt());
        int unreadCount = messageService.UnreadMessageCounter(chatRoom, currentUser);
        dto.setUnreadMessageCounter(unreadCount);

        return dto;
    }

    // Dto mapper for Message.
    public MessageResponseDto mapToMessageResponseDto(Message message) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(message.getId());
        dto.setChatRoomId(message.getChatRoom().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderUserName(message.getSender().getUsername());
        dto.setMessage(message.getMessage());
        dto.setSendAt(message.getSentAt());
        dto.setIsRead(message.getIsRead());
        dto.setMessageType(message.getMessageType());
        return dto;
    }

    // Dto mapper for Review
    public ReviewResponse mapToReviewResponseDto(Review review) {
        ReviewResponse dto = new ReviewResponse();
        dto.setId(review.getId());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());

        if (review.getReviewer() != null) {
            dto.setReviewerId(review.getReviewer().getId());
            dto.setReviewerName(review.getReviewer().getUserName());
            dto.setReviewerEmail(review.getReviewer().getUserEmail());
        }
        if (review.getListing() != null) {
            dto.setListingId(review.getListing().getId());
        }

        if (review.getSeller() != null) {
            dto.setSellerId(review.getSeller().getId());
        }

        return dto;
    }

    // Dto mapper for Moderation
    public ReportResponseDto mapToReportResponseDto(Report report) {
        ReportResponseDto dto = new ReportResponseDto();
        dto.setId(report.getId());
        if (report.getReporter() != null) {
            dto.setReporterId(report.getReporter().getId());
            dto.setReporterUserName(report.getReporter().getUsername());
        }
        if (report.getReportedUser() != null) {
            dto.setReportedId(report.getReportedUser().getId());
            dto.setReportedUserName(report.getReportedUser().getUsername());
        }
        if (report.getListings() != null) {
            dto.setListingId(report.getListings().getId());
            dto.setReportedListingTitle(report.getListings().getTitle());
        }

        dto.setReportType(report.getReportType());
        dto.setReportStatus(report.getStatus());
        dto.setReportReason(report.getReason());

        dto.setReportedAt(report.getReportedAt());
        dto.setResolvedAt(report.getResolvedAt());

        return dto;
    }

    // For Admin.
    public ReportResolveResponse mapToReportResolveResponse(Report report, ReportResolveReqDto req) {
        ReportResolveResponse response = new ReportResolveResponse();
        response.setReportId(report.getId());
        response.setStatus(report.getStatus());
        response.setModerationNotes(report.getModerationNotes());
        response.setActionOnUser(req.getActionOnUser());
        response.setActionOnListing(req.getActionOnListing());
        response.setResolvedAt(report.getResolvedAt());
        return response;
    }
}
