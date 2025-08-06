import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./apiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Resource type mapping
const RESOURCE_TYPE_MAP = {
    notes: "raw",
    avatar: "image",
    coverimage: "image"
};

const uploadOnCloudinary = async (localFilePath, type = "") => {
    try {
        if (!localFilePath) {
            throw new apiError(400, "Local file path is required");
        }

        // Validate and normalize type
        const normalizedType = type.toLowerCase().trim();
        const validTypes = Object.keys(RESOURCE_TYPE_MAP);
        const folder = validTypes.includes(normalizedType)
            ? `studysync/${normalizedType}`
            : "studysync";

        // Get resource type from mapping
        const resourceType = RESOURCE_TYPE_MAP[normalizedType] || "auto";

        // Upload with explicit resource type
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder,
            use_filename: true,
            unique_filename: true
        });

        console.log("✅ Cloudinary Upload Success:", {
            public_id: response.public_id,
            type: response.resource_type,
            format: response.format
        });

        // Clean up local file
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Clean up on error
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("🚨 Cloudinary Upload Error:", error);
        throw new apiError(400, "Cloudinary Upload Error!");
    }
};

const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
    try {
        if (!publicId) {
            throw new apiError(400, "Public ID is required");
        }

        // Sanitize public ID
        const sanitizedId = publicId.trim();

        const response = await cloudinary.uploader.destroy(sanitizedId, {
            resource_type: resourceType,
            invalidate: true // CDN cache invalidation
        });

        // Handle Cloudinary response
        if (response.result !== "ok") {
            throw new apiError(400, `Cloudinary error: ${response.result}`);
        }

        console.log("🗑️ Cloudinary Deletion Success:", {
            public_id: sanitizedId,
            type: resourceType
        });

        return response;

    } catch (error) {
        console.error("🚨 Cloudinary Deletion Error:", {
            publicId,
            error: error.message
        });
        throw new apiError(400, "Cloudinary Deletion Error!");
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };