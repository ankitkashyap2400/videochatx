import { useLocation, useParams } from "react-router-dom";
import MeetingRoom from "../components/MeetingRoom";

function Meeting() {

    const { roomName } = useParams();

    const location = useLocation();

    const participantName =
        location.state?.name || "Guest";

    return (
        <MeetingRoom
            roomName={roomName}
            participantName={participantName}
        />
    );
}

export default Meeting;