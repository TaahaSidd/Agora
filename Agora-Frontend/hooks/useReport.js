import {makeReport} from "../services/reportApi";
import {useUserStore} from "../stores/userStore";
import {useState} from "react";

export const useReport = () => {
    const {currentUser} = useUserStore();
    const [loading, setLoading] = useState(false);

    const submitReport = async (reportType, reason, targetId, details = "") => {
        if (!currentUser || !currentUser.id) {
            console.error("❌ No user logged in");
            return false;
        }

        // Build payload to match backend DTO exactly
        const payload = {
            reportType: reportType.toUpperCase(), // "LISTING" or "USER"
            reportReason: reason.toLowerCase(), // ⭐ LOWERCASE because of @JsonProperty
        };

        // Add the specific ID field based on type
        if (reportType.toUpperCase() === "LISTING") {
            payload.reportedListingId = parseInt(targetId);
        } else if (reportType.toUpperCase() === "USER") {
            payload.reportedUserId = parseInt(targetId);
        }

        // Add custom reason if provided
        if (details && details.trim()) {
            payload.customReason = details.trim();
        }

        console.log("📤 Sending Report Payload:", JSON.stringify(payload, null, 2));
        console.log("📍 Endpoint: /report/Make");
        console.log("👤 Current User:", currentUser.id);

        try {
            setLoading(true);
            const response = await makeReport(payload);
            console.log("✅ Report submitted successfully:", response);
            return true;
        } catch (err) {
            console.error("❌ Report submission failed");
            console.error("Status:", err.response?.status);
            console.error("Error data:", JSON.stringify(err.response?.data, null, 2));
            console.error("Full error:", err);

            // Log the actual request that was sent
            if (err.config) {
                console.error("Request URL:", err.config.url);
                console.error("Request data:", err.config.data);
            }

            return false;
        } finally {
            setLoading(false);
        }
    };

    return {submitReport, loading};
};