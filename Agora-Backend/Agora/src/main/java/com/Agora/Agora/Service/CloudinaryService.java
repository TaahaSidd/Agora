package com.Agora.Agora.Service;

import java.io.InputStream;
import java.util.Map;
import java.io.IOException;
import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private Cloudinary cloudinary;

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public byte[] downloadFileAsBytes(String imageUrl) throws IOException {
        try (InputStream in = new URL(imageUrl).openStream()) {
            return in.readAllBytes();
        }
    }

    // public String uploadFile(MultipartFile file, String filename) throws
    // Exception {
    // byte[] filebytes = file.getBytes();
    // Map uploadResult = uploadIdCard(filebytes, filename);
    // return uploadResult.get("secure_url").toString();
    // }

    public String uploadFile(MultipartFile file, String filename) throws Exception {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        byte[] filebytes = file.getBytes();
        Map uploadResult = uploadIdCard(filebytes, filename);
        return uploadResult.get("secure_url").toString();
    }

    public Map uploadIdCard(byte[] fileBytes, String filename) throws Exception {
        return cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap(
                "folder", "id-cards/",
                "public_id", filename,
                "overwrite", true,
                "resource_type", "image",
                "transformation", new Transformation().quality("auto").fetchFormat("auto")));
    }

    @SuppressWarnings({ "CallToPrintStackTrace", "UseSpecificCatch" })
    public void deleteImages(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
