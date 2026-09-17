const { Server } = require("socket.io");
const {
    clearBuzz,
    getRoomState,
    joinTeam,
    normalizeRoomId,
    registerBuzz,
    scoreBuzzedTeam,
} = require("./roomStore");

function initSocket(server) {
    const allowedOrigins = [
        process.env.USER_FRONTEND,
        process.env.ADMIN_FRONTEND,
    ].filter(Boolean);

    const io = new Server(server, {
        cors: {
            origin: allowedOrigins.length ? allowedOrigins : "*",
            methods: ["GET", "POST"],
        },
    });

    function getAdminRoomId(socket) {
        const { roomId, isAdmin } = socket.data;
        if (!roomId || !isAdmin) return null;
        return roomId;
    }

    function isConfiguredRoom(roomId) {
        return roomId === process.env.ROOM_ID?.trim();
    }

    function socketError(error, callback, fallbackMessage) {
        console.error("Socket operation failed:", error);
        callback?.({ ok: false, message: fallbackMessage });
    }

    function broadcastState(roomId, state) {
        io.to(roomId).emit("room-state", state);
    }

    io.on("connection", (socket) => {
        // ============ TEAM JOINS A ROOM ============
        socket.on("join-room", async ({ roomId, teamName } = {}, callback) => {
            let normalizedRoomId;

            try {
                normalizedRoomId = normalizeRoomId(roomId);
            } catch (error) {
                return callback?.({ ok: false, message: "roomId and teamName are required" });
            }

            if (!teamName) {
                return callback?.({ ok: false, message: "roomId and teamName are required" });
            }

            if (!isConfiguredRoom(normalizedRoomId)) {
                return callback?.({ ok: false, message: "no such room found" });
            }

            try {
                const { team, state } = await joinTeam(normalizedRoomId, teamName);

                socket.data.roomId = normalizedRoomId;
                socket.data.teamId = team._id;
                socket.join(normalizedRoomId);

                callback?.({ ok: true, state });
                broadcastState(normalizedRoomId, state);
            } catch (error) {
                socketError(error, callback, "Unable to join the room");
            }
        });

        // ============ ADMIN JOINS A ROOM ============
        socket.on("join-admin", async ({ roomId } = {}, callback) => {
            let normalizedRoomId;

            try {
                normalizedRoomId = normalizeRoomId(roomId);
            } catch (error) {
                return callback?.({ ok: false, message: "no such room found" });
            }

            if (!isConfiguredRoom(normalizedRoomId)) {
                return callback?.({ ok: false, message: "no such room found" });
            }

            try {
                const state = await getRoomState(normalizedRoomId);

                socket.data.roomId = normalizedRoomId;
                socket.data.isAdmin = true;
                socket.join(normalizedRoomId);

                callback?.({ ok: true, state });
            } catch (error) {
                socketError(error, callback, "Unable to join the room");
            }
        });

        // ============ TEAM BUZZES ============
        socket.on("buzz", async () => {
            const { roomId, teamId } = socket.data;
            if (!roomId || !teamId) return;

            try {
                const { changed, state } = await registerBuzz(roomId, teamId);
                if (changed) broadcastState(roomId, state);
            } catch (error) {
                console.error("Unable to register buzz:", error);
            }
        });

        // ============ ADMIN: MARK CORRECT ============
        socket.on("mark-correct", async () => {
            const roomId = getAdminRoomId(socket);
            if (!roomId) return;

            try {
                const { changed, state } = await scoreBuzzedTeam(roomId, "correct");
                if (changed) broadcastState(roomId, state);
            } catch (error) {
                console.error("Unable to mark answer correct:", error);
            }
        });

        // ============ ADMIN: MARK INCORRECT ============
        socket.on("mark-incorrect", async () => {
            const roomId = getAdminRoomId(socket);
            if (!roomId) return;

            try {
                const { changed, state } = await scoreBuzzedTeam(roomId, "incorrect");
                if (changed) broadcastState(roomId, state);
            } catch (error) {
                console.error("Unable to mark answer incorrect:", error);
            }
        });

        // ============ ADMIN: CLEAR BUZZ ============
        socket.on("clear-buzz", async () => {
            const roomId = getAdminRoomId(socket);
            if (!roomId) return;

            try {
                broadcastState(roomId, await clearBuzz(roomId));
            } catch (error) {
                console.error("Unable to clear buzz:", error);
            }
        });
    });

    return io;
}

module.exports = { initSocket };
