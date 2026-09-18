require("dotenv").config();

const express = require("express");
const cors = require("cors");

const meetingRoutes = require("./routes/meetingRoutes");
const recordingRoutes = require("./routes/recordingRoutes");
const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.use("/api/recordings", recordingRoutes);
app.use(express.json());


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Video Meeting Server Running"
    });

});


// ========================================
// MEETING ROUTES
// ========================================

app.use(
    "/api/meetings",
    meetingRoutes
);


// ========================================
// TEST TOKEN ROUTE
// ========================================

app.post("/test-token-route", (req, res) => {

    res.json({
        message: "TOKEN ROUTE IS WORKING"
    });

});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});