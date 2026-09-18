import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const createMeeting = async () => {
    const response = await API.post("/api/meetings");
    return response.data;
};

export const joinMeeting = async (roomName, participantName) => {
    const response = await API.post("/api/meetings/token", {
        roomName,
        participantName
    });

    return response.data;
};

export const sendMeetingInvite = async (email, roomName) => {
    const response = await API.post("/api/meetings/invite", {
        email,
        roomName
    });

    return response.data;
};

export const saveRecording = async (formData) => {
    const response = await API.post("/api/recordings", formData);
    return response.data;
};

export const getRecordings = async () => {
    const response = await API.get("/api/recordings");
    return response.data;
};