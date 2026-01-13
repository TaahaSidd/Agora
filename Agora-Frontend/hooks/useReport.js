import {useState} from "react";
import {makeReport} from "../services/reportApi";
import {useCurrentUser} from "./useCurrentUser";

export const useReport = () => {
    const {user} = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitReport = async (reportType, reason, targetId, details = "") => {
        if (!user) {
            setError("You must be logged in to report.");
            return false;
        }

        const payload = {
            reportType,
            reportReason: reason,
            details: details
        };

        if (reportType === "LISTING") payload.reportedListingId = targetId;
        if (reportType === "USER") payload.reportedUserId = targetId;
        if (reportType === "CHAT_ROOM" || reportType === "MESSAGE")
            payload.targetId = targetId;

        try {
            setLoading(true);
            setError(null);

            await makeReport(payload);
            return true;
        } catch (err) {
            console.error("Error submitting report:", err);
            setError(err.response?.data?.message || "Failed to report. Try again later.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {submitReport, loading, error};
};
