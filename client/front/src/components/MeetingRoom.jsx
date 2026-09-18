import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer
} from "@livekit/components-react";

import "@livekit/components-styles";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    joinMeeting,
    saveRecording
} from "../services/api";


function MeetingRoom({
    roomName,
    participantName
}) {

    // ========================================
    // LIVEKIT STATE
    // ========================================

    const [token, setToken] = useState(null);

    const [serverUrl, setServerUrl] = useState(null);

    const [error, setError] = useState(null);


    // ========================================
    // RECORDING STATE
    // ========================================

    const [isRecording, setIsRecording] =
        useState(false);

    const [recordingTime, setRecordingTime] =
        useState(0);

    const mediaRecorderRef =
        useRef(null);

    const recordingStartTimeRef =
        useRef(null);

    const recordingTimerRef =
        useRef(null);


    // ========================================
    // GET LIVEKIT TOKEN
    // ========================================

    useEffect(() => {

        console.log("================================");
        console.log("MEETING ROOM");
        console.log("roomName:", roomName);
        console.log("participantName:", participantName);
        console.log("================================");


        // -------------------------------
        // VALIDATE ROOM
        // -------------------------------

        if (
            !roomName ||
            roomName === "undefined" ||
            roomName === "null"
        ) {

            setError(
                "Invalid meeting room name"
            );

            return;
        }


        // -------------------------------
        // VALIDATE PARTICIPANT
        // -------------------------------

        if (
            !participantName ||
            participantName === "undefined"
        ) {

            setError(
                "Invalid participant name"
            );

            return;
        }


        const connect = async () => {

            try {

                console.log(
                    "REQUESTING LIVEKIT TOKEN..."
                );


                const data = await joinMeeting(
                    roomName,
                    participantName
                );


                console.log(
                    "LIVEKIT RESPONSE:",
                    data
                );


                if (
                    !data ||
                    !data.token ||
                    !data.url
                ) {

                    throw new Error(
                        "Invalid LiveKit response"
                    );

                }


                console.log(
                    "TOKEN RECEIVED"
                );


                console.log(
                    "LIVEKIT URL:",
                    data.url
                );


                setToken(data.token);

                setServerUrl(data.url);


            } catch (err) {

                console.error(
                    "LIVEKIT TOKEN ERROR:",
                    err
                );


                setError(

                    err.response?.data?.message ||

                    err.message ||

                    "Could not join meeting"

                );

            }

        };


        connect();


    }, [
        roomName,
        participantName
    ]);


    // ========================================
    // START RECORDING
    // ========================================

    const startRecording = async () => {

        try {

            console.log(
                "REQUESTING SCREEN..."
            );


            // -----------------------------
            // CAPTURE SCREEN
            // -----------------------------

            const stream =
                await navigator.mediaDevices
                    .getDisplayMedia({

                        video: true,

                        audio: true

                    });


            console.log(
                "SCREEN CAPTURE STARTED"
            );


            // -----------------------------
            // CHECK MIME TYPE
            // -----------------------------

            let mimeType =
                "video/webm;codecs=vp9,opus";


            if (
                !MediaRecorder.isTypeSupported(
                    mimeType
                )
            ) {

                mimeType =
                    "video/webm";

            }


            // -----------------------------
            // CREATE RECORDER
            // -----------------------------

            const recorder =
                new MediaRecorder(
                    stream,
                    {
                        mimeType
                    }
                );


            const chunks = [];


            // -----------------------------
            // RECEIVE VIDEO DATA
            // -----------------------------

            recorder.ondataavailable =
                (event) => {

                    if (
                        event.data &&
                        event.data.size > 0
                    ) {

                        chunks.push(
                            event.data
                        );

                    }

                };


            // -----------------------------
            // WHEN RECORDING STOPS
            // -----------------------------

            recorder.onstop = async () => {

                console.log(
                    "RECORDING STOPPED"
                );


                // -------------------------
                // CREATE VIDEO BLOB
                // -------------------------

                const blob =
                    new Blob(
                        chunks,
                        {
                            type: mimeType
                        }
                    );


                console.log(
                    "VIDEO SIZE:",
                    blob.size
                );


                // -------------------------
                // CALCULATE DURATION
                // -------------------------

                const duration =
                    recordingStartTimeRef.current
                        ? Math.floor(
                            (
                                Date.now() -
                                recordingStartTimeRef.current
                            ) / 1000
                        )
                        : recordingTime;


                console.log(
                    "DURATION:",
                    duration,
                    "seconds"
                );


                // -------------------------
                // CREATE FORM DATA
                // -------------------------

                const formData =
                    new FormData();


                formData.append(
                    "video",
                    blob,
                    `recording-${roomName}.webm`
                );


                formData.append(
                    "roomName",
                    roomName
                );


                formData.append(
                    "duration",
                    duration
                );


                // -------------------------
                // SAVE TO DATABASE
                // -------------------------

                try {

                    console.log(
                        "UPLOADING RECORDING..."
                    );


                    const response =
                        await saveRecording(
                            formData
                        );


                    console.log(
                        "RECORDING RESPONSE:",
                        response
                    );


                    alert(
                        "Recording saved successfully!"
                    );


                } catch (error) {

                    console.error(
                        "SAVE RECORDING ERROR:",
                        error
                    );


                    alert(
                        "Could not save recording"
                    );

                }


                // -------------------------
                // STOP SCREEN TRACKS
                // -------------------------

                stream
                    .getTracks()
                    .forEach(
                        (track) => {
                            track.stop();
                        }
                    );

            };


            // -----------------------------
            // HANDLE SCREEN STOP
            // -----------------------------

            stream
                .getVideoTracks()[0]
                .addEventListener(
                    "ended",
                    () => {

                        if (
                            recorder.state !==
                            "inactive"
                        ) {

                            recorder.stop();

                        }

                    }
                );


            // -----------------------------
            // START
            // -----------------------------

            recorder.start();


            mediaRecorderRef.current =
                recorder;


            recordingStartTimeRef.current =
                Date.now();


            setRecordingTime(0);

            setIsRecording(true);


            // -----------------------------
            // TIMER
            // -----------------------------

            recordingTimerRef.current =
                setInterval(() => {

                    setRecordingTime(
                        Math.floor(
                            (
                                Date.now() -
                                recordingStartTimeRef
                                    .current
                            ) / 1000
                        )
                    );

                }, 1000);


            console.log(
                "RECORDING STARTED"
            );


        } catch (error) {

            console.error(
                "START RECORDING ERROR:",
                error
            );


            if (
                error.name ===
                "NotAllowedError"
            ) {

                alert(
                    "Screen sharing permission was cancelled."
                );

            } else {

                alert(
                    "Could not start recording."
                );

            }

        }

    };


    // ========================================
    // STOP RECORDING
    // ========================================

    const stopRecording = () => {

        const recorder =
            mediaRecorderRef.current;


        if (
            !recorder ||
            recorder.state === "inactive"
        ) {

            return;

        }


        console.log(
            "STOPPING RECORDING..."
        );


        recorder.stop();


        setIsRecording(false);


        mediaRecorderRef.current =
            null;


        if (
            recordingTimerRef.current
        ) {

            clearInterval(
                recordingTimerRef.current
            );

            recordingTimerRef.current =
                null;

        }

    };


    // ========================================
    // FORMAT TIME
    // ========================================

    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;


        return (

            `${String(minutes).padStart(2, "0")}:` +

            `${String(remainingSeconds).padStart(2, "0")}`

        );

    };


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (

            <div
                style={{
                    padding: "40px"
                }}
            >

                <h2>
                    Could not join meeting
                </h2>

                <p>
                    {error}
                </p>

            </div>

        );

    }


    // ========================================
    // CONNECTING
    // ========================================

    if (
        !token ||
        !serverUrl
    ) {

        return (

            <div
                style={{
                    padding: "40px"
                }}
            >

                <h2>
                    Connecting to meeting...
                </h2>

                <p>
                    Room: {roomName}
                </p>

                <p>
                    Participant: {participantName}
                </p>

            </div>

        );

    }


    // ========================================
    // LIVEKIT
    // ========================================

    return (

        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative"
            }}
        >

            <LiveKitRoom

                token={token}

                serverUrl={serverUrl}

                connect={true}

                video={true}

                audio={true}


                onConnected={() => {

                    console.log(
                        "CONNECTED TO LIVEKIT"
                    );

                }}


                onDisconnected={() => {

                    console.log(
                        "DISCONNECTED FROM LIVEKIT"
                    );

                }}


                onError={(error) => {

                    console.error(
                        "LIVEKIT ROOM ERROR:",
                        error
                    );

                }}

            >

                <VideoConference />

                <RoomAudioRenderer />


                {/* ================================= */}
                {/* RECORDING BUTTON */}
                {/* ================================= */}

                <div
                    style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "30px",
                        zIndex: 9999
                    }}
                >

                    {!isRecording ? (

                        <button
                            onClick={
                                startRecording
                            }

                            style={{
                                padding:
                                    "12px 20px",

                                background:
                                    "red",

                                color:
                                    "white",

                                border:
                                    "none",

                                borderRadius:
                                    "8px",

                                cursor:
                                    "pointer",

                                fontSize:
                                    "16px",

                                fontWeight:
                                    "bold"
                            }}
                        >

                            🔴 Start Recording

                        </button>

                    ) : (

                        <div>

                            <button
                                onClick={
                                    stopRecording
                                }

                                style={{
                                    padding:
                                        "12px 20px",

                                    background:
                                        "black",

                                    color:
                                        "white",

                                    border:
                                        "none",

                                    borderRadius:
                                        "8px",

                                    cursor:
                                        "pointer",

                                    fontSize:
                                        "16px",

                                    fontWeight:
                                        "bold"
                                }}
                            >

                                ⏹ Stop Recording

                            </button>


                            <div
                                style={{
                                    marginTop:
                                        "8px",

                                    background:
                                        "white",

                                    padding:
                                        "5px 10px",

                                    borderRadius:
                                        "5px",

                                    textAlign:
                                        "center"
                                }}
                            >

                                Recording:{" "}

                                {formatTime(
                                    recordingTime
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </LiveKitRoom>

        </div>

    );

}


export default MeetingRoom;