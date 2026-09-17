const { getRoomState, normalizeRoomId } = require("../../socket/roomStore");

const getRoomStateController = async (req, res) => {
    try {
        const roomId = normalizeRoomId(req.params.roomId);

        if (roomId !== process.env.ROOM_ID?.trim()) {
            return res.status(404).json({
                message: "No such room found.",
            });
        }

        return res.status(200).json(await getRoomState(roomId));
    } catch (error) {
        const isValidationError = error.message === "A room ID is required.";

        return res.status(isValidationError ? 400 : 500).json({
            message: isValidationError ? error.message : "Unable to load the room state.",
        });
    }
};

module.exports = { getRoomStateController };
