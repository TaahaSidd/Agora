import { apiPost } from "./api";

export const makeReport = async (reportData) => {
    try {
        const res = await apiPost("/report/Make", reportData);
        return res;
    } catch (error) {
        console.error("Failed to submit report:", error);
        throw error;
    }
};