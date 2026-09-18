const express = require("express");
const router = express.Router();

const { AccessToken } = require("livekit-server-sdk");


const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// ========================================
// CREATE MEETING
// POST /api/meetings
// ========================================

router.post("/", async (req, res) => {
    try {

        const code = Math.random()
            .toString(36)
            .substring(2, 8);

        console.log("CREATE MEETING:", code);

        res.status(201).json({
            success: true,
            meeting: {
                code
            }
        });

    } catch (error) {

        console.error("CREATE MEETING ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Could not create meeting"
        });
    }
});


// ========================================
// JOIN MEETING / CREATE LIVEKIT TOKEN
// POST /api/meetings/token
// ========================================

router.post("/token", async (req, res) => {

    try {

        const {
            roomName,
            participantName
        } = req.body;

        console.log("TOKEN REQUEST:", {
            roomName,
            participantName
        });

        // -------------------------------
        // VALIDATE ROOM
        // -------------------------------

        if (
            !roomName ||
            roomName === "undefined" ||
            roomName === "null"
        ) {

            return res.status(400).json({
                success: false,
                message: "Valid roomName is required"
            });
        }


        // -------------------------------
        // VALIDATE PARTICIPANT
        // -------------------------------

        if (
            !participantName ||
            participantName === "undefined" ||
            participantName === "null"
        ) {

            return res.status(400).json({
                success: false,
                message: "Valid participantName is required"
            });
        }


        // -------------------------------
        // CHECK LIVEKIT CONFIG
        // -------------------------------

        if (!process.env.LIVEKIT_API_KEY) {

            return res.status(500).json({
                success: false,
                message: "LIVEKIT_API_KEY missing"
            });
        }

        if (!process.env.LIVEKIT_API_SECRET) {

            return res.status(500).json({
                success: false,
                message: "LIVEKIT_API_SECRET missing"
            });
        }

        if (!process.env.LIVEKIT_URL) {

            return res.status(500).json({
                success: false,
                message: "LIVEKIT_URL missing"
            });
        }


        // -------------------------------
        // CREATE TOKEN
        // -------------------------------

        const token = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            {
                identity: participantName,
                ttl: "1h"
            }
        );


        // -------------------------------
        // ROOM PERMISSIONS
        // -------------------------------

        token.addGrant({

            roomJoin: true,

            room: roomName,

            canPublish: true,

            canSubscribe: true

        });


        // -------------------------------
        // GENERATE JWT
        // -------------------------------

        const jwt = await token.toJwt();


        console.log(
            "LIVEKIT TOKEN CREATED FOR:",
            roomName,
            participantName
        );

        //mail//

        router.post("/invite", async (req, res) => {

    try {

        const {
            email,
            roomName
        } = req.body;

        if (!email || !roomName) {

            return res.status(400).json({
                success: false,
                message: "Email and roomName are required"
            });

        }

        const meetingLink =
            `${process.env.FRONTEND_URL}/meeting/${roomName}`;

        await transporter.sendMail({

            from: `"Video Meeting" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "You are invited to a video meeting",

            html: `
                <h2>You are invited to a meeting</h2>

                <p>
                    You have been invited to join a video meeting.
                </p>

                <p>
                    Meeting ID:
                    <strong>${roomName}</strong>
                </p>

                <p>
                    <a href="${meetingLink}">
                        Join Meeting
                    </a>
                </p>

                <p>
                    Meeting Link:
                    ${meetingLink}
                </p>
            `
        });

        res.json({
            success: true,
            message: "Invitation sent successfully"
        });

    } catch (error) {

        console.error("EMAIL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Could not send invitation"
        });

    }

});
        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.json({

            success: true,

            token: jwt,

            url: process.env.LIVEKIT_URL

        });

    } catch (error) {

        console.error(
            "LIVEKIT TOKEN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });
    }
});

module.exports = router;