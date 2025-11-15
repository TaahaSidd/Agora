import { useState } from "react";
import { makeReport } from "../services/reportApi";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const useReport = () => {
    const { user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitReport = async (reportType, reason, targetId) => {
        if (!user) {
            setError("You must be logged in to report.");
            return false;
        }

        const payload = { reportType, reportReason: reason };
        if (reportType === "LISTING") payload.reportedListingId = targetId;
        if (reportType === "USER") payload.reportedUserId = targetId;
        if (reportType === "CHAT_ROOM" || reportType === "MESSAGE")
            payload.targetId = targetId;

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await makeReport(payload);
            setSuccess(true);
            return true;
        } catch (err) {
            console.error("Error submitting report:", err);
            setError("Failed to report. Try again later.");
            return false;
        } finally {
            setLoading(false);
        }
    }
    return { submitReport, loading, error, success };
};
