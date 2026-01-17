import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dtdssypwf";
const LISTING_PRESET = "Agora_App_1";
const PROFILE_PRESET = "Agora_Profiles";

export const uploadToCloudinary = async (uri) => {
    try {
        const data = new FormData();
        data.append("file", { uri, type: "image/jpeg", name: "upload.jpg" });
        data.append("upload_preset", LISTING_PRESET);
        data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("Cloudinary response:", res.data);
        return {
            url: res.data.secure_url,
            publicId: res.data.public_id,
        };
    } catch (err) {
        console.log("Cloudinary upload error:", err.message || err);
        throw err;
    }
};

export const uploadProfilePicture = async (uri) => {
    try {
        const data = new FormData();
        data.append("file", { uri, type: "image/jpeg", name: "profile.jpg" });
        data.append("upload_preset", "Agora_App_1");
        data.append("cloud_name", "dtdssypwf");
        data.append("folder", "profiles");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dtdssypwf/image/upload",
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("✅ Uploaded to:", res.data.secure_url);
        return {
            url: res.data.secure_url,
            publicId: res.data.public_id,
        };
    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        throw err;
    }
};


// will be used when preset issue from cloudinary is resolved
// export const uploadProfilePicture = async (uri) => {
//     try {
//         const data = new FormData();
//         data.append("file", { uri, type: "image/jpeg", name: "profile.jpg" });
//         data.append("upload_preset", PROFILE_PRESET);
//         data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
//         data.append("folder", "profiles");

//         data.append("transformation", JSON.stringify([
//             { width: 500, height: 500, crop: "fill", quality: "auto" }
//         ]));

//         const res = await axios.post(
//             `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//             data,
//             { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         console.log("✅ Profile picture uploaded:", res.data.secure_url);
//         return {
//             url: res.data.secure_url,
//             publicId: res.data.public_id,
//         };
//     } catch (err) {
//         console.error("❌ Profile upload error:", err.message || err);
//         throw err;
//     }
// };