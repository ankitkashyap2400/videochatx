import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../services/api";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const [meetingId, setMeetingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreateMeeting = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await createMeeting();

            const code = data.meeting.code;

            navigate(`/meeting/${code}`);

        } catch (err) {
            console.error(err);

            setError("Could not create meeting");

        } finally {
            setLoading(false);
        }
    };

    const handleJoinMeeting = () => {
        const code = meetingId.trim();

        if (!code) {
            setError("Please enter a meeting ID");
            return;
        }

        setError("");

        navigate(`/meeting/${code}`);
    };

    return (
        <div className="home-page">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">
                    <span className="logo-icon">●</span>
                    <span>MeetNow</span>
                </div>

                <div className="nav-text">
                    Simple. Fast. Secure.
                </div>

            </nav>


            {/* HERO */}

            <section className="hero">

                <div className="hero-badge">
                    🎥 Video meetings made simple
                </div>

                <h1>
                    Connect with anyone,
                    <br />
                    <span>anywhere.</span>
                </h1>

                <p>
                    Start a video meeting instantly or join
                    an existing meeting with a simple code.
                </p>

            </section>


            {/* MEETING CARD */}

            <section className="meeting-section">

                <div className="meeting-card">

                    {/* CREATE */}

                    <div className="meeting-option">

                        <div className="option-icon">
                            +
                        </div>

                        <div>
                            <h2>
                                Start a new meeting
                            </h2>

                            <p>
                                Create a meeting and share
                                the link with others.
                            </p>
                        </div>

                        <button
                            className="primary-button"
                            onClick={handleCreateMeeting}
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Meeting"}
                        </button>

                    </div>


                    {/* DIVIDER */}

                    <div className="or-divider">

                        <span></span>

                        <strong>OR</strong>

                        <span></span>

                    </div>


                    {/* JOIN */}

                    <div className="meeting-option">

                        <div className="option-icon join-icon">
                            →
                        </div>

                        <div>
                            <h2>
                                Join a meeting
                            </h2>

                            <p>
                                Enter the meeting ID you received.
                            </p>
                        </div>

                        <div className="join-form">

                            <input
                                type="text"
                                placeholder="Enter meeting ID"
                                value={meetingId}
                                onChange={(e) =>
                                    setMeetingId(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleJoinMeeting();
                                    }
                                }}
                            />

                            <button
                                className="secondary-button"
                                onClick={handleJoinMeeting}
                            >
                                Join
                            </button>

                        </div>

                    </div>


                    {error && (
                        <div className="home-error">
                            {error}
                        </div>
                    )}

                </div>

            </section>


            {/* FEATURES */}

            <section className="features">

                <div className="feature">

                    <div className="feature-icon">
                        🎙️
                    </div>

                    <h3>
                        HD Audio
                    </h3>

                    <p>
                        Clear communication
                    </p>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        📹
                    </div>

                    <h3>
                        Video
                    </h3>

                    <p>
                        Face-to-face meetings
                    </p>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        🖥️
                    </div>

                    <h3>
                        Screen Share
                    </h3>

                    <p>
                        Share your screen
                    </p>

                </div>


                <div className="feature">

                    <div className="feature-icon">
                        🔗
                    </div>

                    <h3>
                        Easy Sharing
                    </h3>

                    <p>
                        Share meeting links
                    </p>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="home-footer">
                © 2026 MeetNow · Simple video meetings
            </footer>

        </div>
    );
}


export default Home;