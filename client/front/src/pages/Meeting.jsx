import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import MeetingRoom from "../components/MeetingRoom";

import {sendMeetingInvite} from "../services/api";


function Meeting() {
    const { roomName: paramRoomName, code } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const [roomName, setRoomName] = useState(null);
    const [participantName, setParticipantName] = useState("");
    const [nameInput, setNameInput] = useState("");

    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);









    const [inviteEmail, setInviteEmail] =
    useState("");

const [emailSending, setEmailSending] =
    useState(false);

const [emailSent, setEmailSent] =
    useState(false);
    // ========================================
    // GET ROOM NAME
    // ========================================

    useEffect(() => {

        console.log("================================");
        console.log("MEETING PAGE");
        console.log("================================");

        const searchParams =
            new URLSearchParams(location.search);

        const queryRoomName =
            searchParams.get("roomName");

        const stateRoomName =
            location.state?.roomName;

        const finalRoomName =
            paramRoomName ||
            code ||
            stateRoomName ||
            queryRoomName;

        console.log(
            "FINAL ROOM NAME:",
            finalRoomName
        );

        if (!finalRoomName) {

            setError(
                "Meeting room name is missing"
            );

            return;
        }

        setRoomName(finalRoomName);

        if (location.state?.participantName) {

            setParticipantName(
                location.state.participantName
            );

        }

    }, [
        paramRoomName,
        code,
        location
    ]);


    // ========================================
    // SHARE LINK
    // ========================================

    const shareLink =
        roomName
            ? `${window.location.origin}/meeting/${roomName}`
            : "";


//send mail//
 const sendInvite = async () => {

    const email =
        inviteEmail.trim();

    if (!email) {

        setError(
            "Please enter an email address"
        );

        return;
    }


    try {

        setError(null);

        setEmailSending(true);

        setEmailSent(false);


        await sendMeetingInvite(
            email,
            roomName
        );


        setEmailSent(true);

        setInviteEmail("");


    } catch (error) {

        console.error(
            "SEND INVITE ERROR:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Could not send invitation"
        );

    } finally {

        setEmailSending(false);

    }

};

    // ========================================
    // COPY LINK
    // ========================================

    const copyMeetingLink = async () => {

        try {

            await navigator.clipboard.writeText(
                shareLink
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "COPY ERROR:",
                error
            );

        }

    };
const sendEmailInvite = () => {
    const subject = "Join my video meeting";

    const body = `Hi,

You are invited to join my video meeting.

Join meeting:
${shareLink}

Meeting ID: ${roomName}
`;

    window.location.href =
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

    // ========================================
    // JOIN MEETING
    // ========================================

    const joinMeeting = () => {

        const name =
            nameInput.trim();

        if (!name) {

            setError(
                "Please enter your name"
            );

            return;
        }

        setError(null);

        setParticipantName(name);

    };


    // ========================================
    // ERROR
    // ========================================

    if (error && !participantName) {

        return (

            <div className="meeting-page">

                <div className="error-card">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Could not join meeting
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="secondary-button"
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>

                </div>

            </div>

        );

    }


    // ========================================
    // LOADING
    // ========================================

    if (!roomName) {

        return (

            <div className="meeting-page">

                <div className="loading-card">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading meeting...
                    </h2>

                </div>

            </div>

        );

    }


    // ========================================
    // ASK FOR NAME
    // ========================================

    if (!participantName) {

        return (

            <div className="meeting-page">

                <div className="join-card">

                    {/* LOGO */}

                    <div className="meeting-logo">
                        <span>●</span>
                        Meet
                    </div>


                    {/* TITLE */}

                    <h1>
                        Join Meeting
                    </h1>

                    <p className="join-description">
                        Enter Your Name To Join The Meeting
                    </p>


                    {/* MEETING ID */}

                    <div className="meeting-id-box">

                        <span>
                            Meeting ID
                        </span>

                        <strong>
                            {roomName}
                        </strong>

                    </div>


                    {/* NAME */}

                    <label className="input-label">
                        Your Name 
                    </label>

                    <input
                        className="name-input"
                        type="text"
                        placeholder="Enter your name"
                        value={nameInput}
                        onChange={(e) =>
                            setNameInput(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                joinMeeting();
                            }

                        }}
                        autoFocus
                    />


                    {/* ERROR */}

                    {error && (

                        <p className="form-error">
                            {error}
                        </p>

                    )}


                    {/* JOIN */}

                    <button
                        className="join-button"
                        onClick={joinMeeting}
                    >
                        Join Meeting
                    </button>


                    {/* DIVIDER */}

                    <div className="divider">
                        <span>or</span>
                    </div>


                    {/* SHARE */}

                    <div className="share-section">

                        <h3>
                            Invite others
                        </h3>

                        <p>
                            Share this link with people
                            you want to join.
                        </p>


                        <div className="link-container">

                            <input
                                className="link-input"
                                type="text"
                                value={shareLink}
                                readOnly
                            />

                            <button
                                className="copy-button"
                                onClick={
                                    copyMeetingLink
                                }
                            >

                                {copied
                                    ? "✓"
                                    : "Copy"}

                            </button>
<div className="email-invite">

    <h3>
        Invite by Email
    </h3>

    <div className="email-invite-box">

        <input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) =>
                setInviteEmail(e.target.value)
            }
        />

        <button
            onClick={sendInvite}
            disabled={emailSending}
        >
            {emailSending
                ? "Sending..."
                : "Send Invite"}
        </button>

    </div>


    {emailSent && (

        <p className="email-success">
            ✓ Invitation sent successfully
        </p>

    )}

</div>
                        </div>


                        {copied && (

                            <p className="copied-message">
                                Meeting link copied!
                            </p>

                        )}
                    <div className="invite-link-box">

    

    

</div>


                    </div>

                </div>

            </div>

        );

    }


    // ========================================
    // LIVEKIT MEETING
    // ========================================

    return (

        <MeetingRoom
            roomName={roomName}
            participantName={participantName}
        />

    );

}
export default Meeting;