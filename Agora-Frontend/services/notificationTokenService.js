import { apiPost } from "./api";

export const saveExpoPushToken = async (userId, token) => {
    console.log('💾 saveExpoPushToken called');
    console.log('   userId:', userId);
    console.log('   token:', token);

    try {
        const response = await apiPost('/expo/save-token', {
            userId,
            expoToken: token,
        });

        console.log("✅ Expo push token saved successfully:", response);
    } catch (error) {
        console.error("❌ Failed to save expo push token:", error);
        console.error("   Error response:", error.response?.data);
    }
};

