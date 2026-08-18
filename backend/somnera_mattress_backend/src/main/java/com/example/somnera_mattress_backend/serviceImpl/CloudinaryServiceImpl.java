package com.example.somnera_mattress_backend.serviceImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl
        implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, String> uploadProductImage(
            MultipartFile file
    ) {

        validateImage(file);

        try {

            Map uploadResult =
                    cloudinary
                            .uploader()
                            .upload(
                                    file.getBytes(),
                                    ObjectUtils.asMap(
                                            "folder",
                                            "somnera/products"
                                    )
                            );

            return Map.of(
                    "url",
                    uploadResult
                            .get("secure_url")
                            .toString(),

                    "publicId",
                    uploadResult
                            .get("public_id")
                            .toString()
            );

        } catch (IOException exception) {

            throw new BadRequestException(
                    "Unable to upload product image"
            );
        }
    }

    @Override
    public void deleteImage(
            String publicId
    ) {

        if (
                publicId == null
                        || publicId.isBlank()
        ) {
            return;
        }

        try {

            cloudinary
                    .uploader()
                    .destroy(
                            publicId,
                            ObjectUtils.emptyMap()
                    );

        } catch (IOException exception) {

            throw new BadRequestException(
                    "Unable to delete product image"
            );
        }
    }

    private void validateImage(
            MultipartFile file
    ) {

        if (
                file == null
                        || file.isEmpty()
        ) {
            throw new BadRequestException(
                    "Product image is required"
            );
        }

        String contentType =
                file.getContentType();

        if (
                contentType == null
                        || (
                        !contentType.equals(
                                "image/jpeg"
                        )
                                && !contentType.equals(
                                "image/png"
                        )
                                && !contentType.equals(
                                "image/webp"
                        )
                )
        ) {

            throw new BadRequestException(
                    "Only JPG, PNG and WEBP images are allowed"
            );
        }

        long maxSize =
                5 * 1024 * 1024;

        if (file.getSize() > maxSize) {

            throw new BadRequestException(
                    "Product image must be smaller than 5 MB"
            );
        }
    }
}