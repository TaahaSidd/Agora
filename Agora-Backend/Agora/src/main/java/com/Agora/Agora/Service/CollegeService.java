package com.Agora.Agora.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.Agora.Agora.Dto.Request.CollegeReqDto;
import com.Agora.Agora.Dto.Response.CollegeResponseDto;
import com.Agora.Agora.Mapper.DtoMapper;
import com.Agora.Agora.Model.College;
import com.Agora.Agora.Repository.CollegeRepo;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollegeService {

    private final CollegeRepo collegeRepo;
    private final DtoMapper dto;

    @Transactional
    public CollegeResponseDto addCollege(CollegeReqDto req) {

        College college = new College();

        college.setCollegeName(req.getCollegeName());
        college.setCollegeEmail(req.getCollegeEmail());
        college.setAddress(req.getAddress());
        college.setCity(req.getCity());
        college.setState(req.getState());
        college.setCountry(req.getCountry());
        college.setWebsite(req.getWebsite());

        College savedCollege = collegeRepo.save(college);

        CollegeResponseDto responseDto = dto.mapToCollegeResponseDto(savedCollege);
        return responseDto;
    }

    // Get All Colleges.
    public List<CollegeResponseDto> getAllColleges() {
        List<College> college = collegeRepo.findAll();

        return college.stream()
                .map(dto::mapToCollegeResponseDto)
                .collect(Collectors.toList());
    }

    //Search Colleges.
    public List<CollegeResponseDto> searchColleges(String query) {
        PageRequest limit = PageRequest.of(0, 20);
        List<College> colleges = collegeRepo.searchByCollegeName(query.trim(), limit);
        return colleges.stream()
                .map(dto::mapToCollegeResponseDto)
                .collect(Collectors.toList());
    }

    // Get college by id
    public CollegeResponseDto getCollegeById(Long id) {
        College college = collegeRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        CollegeResponseDto responseDto = dto.mapToCollegeResponseDto(college);

        return responseDto;
    }

    // Update College.
    @Transactional
    public CollegeResponseDto updateCollege(Long id, CollegeReqDto req) {
        College college = collegeRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        college.setCollegeName(req.getCollegeName());
        college.setCollegeEmail(req.getCollegeEmail());
        college.setAddress(req.getAddress());
        college.setCity(req.getCity());
        college.setState(req.getState());
        college.setCountry(req.getCountry());
        college.setWebsite(req.getWebsite());

        College updatedCollege = collegeRepo.save(college);

        CollegeResponseDto responseDto = dto.mapToCollegeResponseDto(updatedCollege);

        return responseDto;
    }

    // Deleting Colleges.
    public void deleteCollege(Long id) {
        College college = collegeRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("College not found"));

        collegeRepo.delete(college);
    }

}
