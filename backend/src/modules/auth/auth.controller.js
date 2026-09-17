const { joinTeam, normalizeRoomId, normalizeTeamName } = require("../../socket/roomStore");

const authController = async (req, res) => {
    try {
        const roomId = normalizeRoomId(req.body?.roomId);
        const name = normalizeTeamName(req.body?.name);

        if (roomId !== process.env.ROOM_ID?.trim()) {
            return res.status(404).json({
                message: "No such room found.",
            });
        }

        const { team } = await joinTeam(roomId, name);

        return res.status(200).json({
            message: "Successfully joined the room.",
            team: {
                id: team._id,
                name: team.name,
                score: team.score,
            },
        });
    } catch (error) {
        const isValidationError = error.message === "A room ID is required." || error.message === "A team name between 1 and 40 characters is required.";

        return res.status(isValidationError ? 400 : 500).json({
            message: isValidationError ? error.message : "Unable to join the room. Please try again.",
        });
    }
};

module.exports = { authController };
