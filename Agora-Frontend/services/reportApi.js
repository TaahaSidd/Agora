import { apiPost } from "./api";

/**
 * Report something (listing, user, chat, etc.)
 * @param {Object} reportData
 * @param {'LISTING'|'USER'|'CHAT_ROOM'|'MESSAGE'} reportData.reportType
 * @param {string} reportData.reportReason
 * @param {number} [reportData.reportedUserId]
 * @param {number} [reportData.reportedListingId]
 * @param {number} [reportData.targetId]
 */

export const makeReport = async (reportData) => {
    try {
        const res = await apiPost("/report/Make", reportData);
        return res;
    } catch (error) {
        console.error("Failed to submit report:", error);
        throw error;
    }
};