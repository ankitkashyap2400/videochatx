const {
    AccessToken
} = require("livekit-server-sdk");

const createLiveKitToken = async (
    roomName,
    participantName
) => {

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantName,
            name: participantName
        }
    );

    token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true
    });

    return await token.toJwt();
};

module.exports = {
    createLiveKitToken
};