import axios from "axios";

export const uploadToCloudinary = async (uri) => {
    try {
        const data = new FormData();
        data.append("file", { uri, type: "image/jpeg", name: "upload.jpg" });
        data.append("upload_preset", "Agora_App_1");
        data.append("cloud_name", "dtdssypwf");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dtdssypwf/image/upload",
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Cloudinary response:", res.data);
        console.log("Public id:", res.publicId);
        return {
            url: res.data.secure_url,
            publicId: res.data.public_id,
        };
    } catch (err) {
        console.log("Cloudinary upload error:", err.message || err);
        throw err;
    }
};
