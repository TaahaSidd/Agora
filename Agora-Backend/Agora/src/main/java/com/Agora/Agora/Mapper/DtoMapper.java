package com.Agora.Agora.Mapper;

import org.springframework.stereotype.Component;

import com.Agora.Agora.Dto.Response.CollegeResponseDto;
import com.Agora.Agora.Dto.Response.ListingResponseDto;
import com.Agora.Agora.Dto.Response.RegistrationResponseDto;
import com.Agora.Agora.Dto.Response.UserResponseDto;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Model.Listings;
import com.Agora.Agora.Model.User;

@Component
public class DtoMapper {

    // Dto mapping for User.
    public UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setUserEmail(user.getUserEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setIdCardNo(user.getIdCardNo());
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
    public RegistrationResponseDto mapToRegistrationResponseDto(User user) {
        RegistrationResponseDto dto = new RegistrationResponseDto();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setUserEmail(user.getUserEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setIdCardNo(user.getIdCardNo());
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
        dto.setCollegeName(college.getCollegeName());
        dto.setCollegeEmail(college.getCollegeEmail());
        dto.setAddress(college.getAddress());
        dto.setCity(college.getCity());
        dto.setState(college.getState());
        dto.setCountry(college.getCountry());
        dto.setWebsite(college.getWebsite());

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
        // dto.setItemAvailability(listing.getItemAvailability()); ADD THIS WHEN
        // DROPPING
        // THE TABLE FOR LISTING.

        dto.setSeller(mapToUserResponseDto(listing.getSeller()));
        if (listing.getSeller() != null && listing.getSeller().getCollege() != null) {
            dto.setCollege(mapToCollegeResponseDto(listing.getSeller().getCollege()));
        }
        return dto;
    }
}
