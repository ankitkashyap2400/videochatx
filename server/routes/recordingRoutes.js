const express = require("express");
const router = express.Router();

const multer = require("multer");
const pool = require("../db");


// ========================================
// MULTER CONFIGURATION
// ========================================

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        // Maximum recording size = 50 MB
        fileSize: 50 * 1024 * 1024
    }
});


// ========================================
// SAVE RECORDING
// POST /api/recordings
// ========================================



router.post(
    "/",
    upload.single("video"),
    async (req, res) => {

        try {

            const {
                roomName,
                duration
            } = req.body;


            console.log(
                "================================"
            );

            console.log(
                "RECORDING REQUEST"
            );

            console.log(
                "Room:",
                roomName
            );

            console.log(
                "Duration:",
                duration
            );

            console.log(
                "File:",
                req.file?.originalname
            );

            console.log(
                "================================"
            );


            // ========================================
            // VALIDATE ROOM
            // ========================================

            if (!roomName) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Room name is required"

                });

            }


            // ========================================
            // VALIDATE VIDEO
            // ========================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Video file is required"

                });

            }


            // ========================================
            // INSERT VIDEO INTO POSTGRESQL
            // ========================================

            const result =
                await pool.query(

                    `INSERT INTO recordings
                    (
                        room_name,
                        video_data,
                        mime_type,
                        duration
                    )
                    VALUES
                    ($1, $2, $3, $4)
                    RETURNING
                        id,
                        room_name,
                        mime_type,
                        duration,
                        created_at`,

                    [
                        roomName,

                        req.file.buffer,

                        req.file.mimetype,

                        Number(duration) || 0
                    ]

                );


            console.log(
                "RECORDING SAVED:"
            );

            console.log(
                result.rows[0]
            );


            // ========================================
            // RESPONSE
            // ========================================

            res.status(201).json({

                success: true,

                message:
                    "Recording saved successfully",

                recording:
                    result.rows[0]

            });


        } catch (error) {

            console.error(
                "RECORDING SAVE ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Could not save recording"

            });

        }

    }
);


// ========================================
// GET ALL RECORDINGS
// GET /api/recordings
// ========================================

router.get(
    "/",
    async (req, res) => {

        try {

            const result =
                await pool.query(

                    `SELECT
                        id,
                        room_name,
                        mime_type,
                        duration,
                        created_at
                     FROM recordings
                     ORDER BY created_at DESC`

                );


            res.json({

                success: true,

                recordings:
                    result.rows

            });


        } catch (error) {

            console.error(
                "GET RECORDINGS ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Could not fetch recordings"

            });

        }

    }
);


// ========================================
// GET SINGLE RECORDING VIDEO
// GET /api/recordings/:id
// ========================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const result =
                await pool.query(

                    `SELECT
                        video_data,
                        mime_type
                     FROM recordings
                     WHERE id = $1`,

                    [id]

                );


            // ========================================
            // RECORDING NOT FOUND
            // ========================================

            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Recording not found"

                });

            }


            const recording =
                result.rows[0];


            // ========================================
            // SEND VIDEO
            // ========================================

            res.setHeader(
                "Content-Type",
                recording.mime_type
            );


            res.send(
                recording.video_data
            );


        } catch (error) {

            console.error(
                "GET RECORDING ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Could not retrieve recording"

            });

        }

    }
);


module.exports = router;