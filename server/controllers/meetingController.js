const db = require("../db");

const {
    createLiveKitToken
} = require("../services/livekitService");


const createMeeting = async (req, res) => {

    try {

        const roomName =
            Math.random()
                .toString(36)
                .substring(2, 8);

        const result = await db.query(
            `
            INSERT INTO meetings (room_name)
            VALUES ($1)
            RETURNING *
            `,
            [roomName]
        );

        res.status(201).json({
            success: true,
            meeting: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create meeting"
        });

    }
};


const joinMeeting = async (req, res) => {

    try {

        const {
            roomName,
            participantName
        } = req.body;

        if (!roomName || !participantName) {

            return res.status(400).json({
                success: false,
                message:
                    "Room name and participant name required"
            });

        }

        const result = await db.query(
            `
            SELECT *
            FROM meetings
            WHERE room_name = $1
            `,
            [roomName]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });

        }

        const token =
            await createLiveKitToken(
                roomName,
                participantName
            );

        res.json({
            success: true,
            token,
            url: process.env.LIVEKIT_URL,
            roomName,
            participantName
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to join meeting"
        });

    }
};


module.exports = {
    createMeeting,
    joinMeeting
};