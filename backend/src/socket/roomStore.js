const { randomUUID } = require("node:crypto");
const { getDatabase } = require("../database");

function normalizeRoomId(roomId) {
    const normalizedRoomId = String(roomId ?? "").trim();

    if (!normalizedRoomId) {
        throw new Error("A room ID is required.");
    }

    return normalizedRoomId;
}

function normalizeTeamName(teamName) {
    const normalizedTeamName = typeof teamName === "string"
        ? teamName.trim().replace(/\s+/g, " ")
        : "";

    if (!normalizedTeamName || normalizedTeamName.length > 40) {
        throw new Error("A team name between 1 and 40 characters is required.");
    }

    return normalizedTeamName;
}

function teamKey(teamName) {
    return teamName.toLocaleLowerCase();
}

async function ensureRoom(roomId) {
    const normalizedRoomId = normalizeRoomId(roomId);
    const rooms = getDatabase().collection("rooms");
    const now = new Date();

    try {
        await rooms.updateOne(
            { _id: normalizedRoomId },
            {
                $setOnInsert: {
                    status: "waiting",
                    buzzedTeamId: null,
                    buzzedTeamName: null,
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true }
        );
    } catch (error) {
        // Another request may have created this room between the match and insert.
        if (error.code !== 11000) throw error;
    }

    return rooms.findOne({ _id: normalizedRoomId });
}

async function getRoomState(roomId) {
    const room = await ensureRoom(roomId);
    const teams = await getDatabase()
        .collection("teams")
        .find({ roomId: room._id })
        .sort({ score: -1, name: 1 })
        .toArray();

    return toPublicState(room, teams);
}

async function joinTeam(roomId, teamName) {
    const normalizedRoomId = normalizeRoomId(roomId);
    const normalizedTeamName = normalizeTeamName(teamName);
    const now = new Date();

    await ensureRoom(normalizedRoomId);

    const team = await getDatabase().collection("teams").findOneAndUpdate(
        { roomId: normalizedRoomId, key: teamKey(normalizedTeamName) },
        {
            $set: {
                name: normalizedTeamName,
                updatedAt: now,
            },
            $setOnInsert: {
                _id: randomUUID(),
                roomId: normalizedRoomId,
                key: teamKey(normalizedTeamName),
                score: 0,
                createdAt: now,
            },
        },
        { upsert: true, returnDocument: "after" }
    );

    return {
        team,
        state: await getRoomState(normalizedRoomId),
    };
}

async function registerBuzz(roomId, teamId) {
    const normalizedRoomId = normalizeRoomId(roomId);
    const teams = getDatabase().collection("teams");
    const rooms = getDatabase().collection("rooms");
    const team = await teams.findOne({ _id: teamId, roomId: normalizedRoomId });

    if (!team) {
        throw new Error("The team must join the room before buzzing.");
    }

    const room = await rooms.findOneAndUpdate(
        { _id: normalizedRoomId, status: "waiting" },
        {
            $set: {
                status: "buzzed",
                buzzedTeamId: team._id,
                buzzedTeamName: team.name,
                updatedAt: new Date(),
            },
        },
        { returnDocument: "after" }
    );

    return {
        changed: Boolean(room),
        state: await getRoomState(normalizedRoomId),
    };
}

async function scoreBuzzedTeam(roomId, result) {
    const normalizedRoomId = normalizeRoomId(roomId);
    const status = result === "correct" ? "correct" : "incorrect";
    const scoreChange = status === "correct" ? 5 : -5;
    const rooms = getDatabase().collection("rooms");
    const room = await rooms.findOneAndUpdate(
        { _id: normalizedRoomId, status: "buzzed", buzzedTeamId: { $ne: null } },
        {
            $set: {
                status,
                updatedAt: new Date(),
            },
        },
        { returnDocument: "after" }
    );

    if (!room) {
        return {
            changed: false,
            state: await getRoomState(normalizedRoomId),
        };
    }

    await getDatabase().collection("teams").updateOne(
        { _id: room.buzzedTeamId, roomId: normalizedRoomId },
        [
            {
                $set: {
                    score: { $max: [0, { $add: ["$score", scoreChange] }] },
                    updatedAt: new Date(),
                },
            },
        ]
    );

    return {
        changed: true,
        state: await getRoomState(normalizedRoomId),
    };
}

async function clearBuzz(roomId) {
    const normalizedRoomId = normalizeRoomId(roomId);

    await ensureRoom(normalizedRoomId);
    await getDatabase().collection("rooms").updateOne(
        { _id: normalizedRoomId },
        {
            $set: {
                status: "waiting",
                buzzedTeamId: null,
                buzzedTeamName: null,
                updatedAt: new Date(),
            },
        }
    );

    return getRoomState(normalizedRoomId);
}

function toPublicState(room, teams) {
    return {
        teams: teams.map(({ _id, name, score }) => ({
            id: _id,
            name,
            score,
        })),
        status: room.status,
        buzzedTeam: room.buzzedTeamName,
    };
}

module.exports = {
    clearBuzz,
    getRoomState,
    joinTeam,
    normalizeRoomId,
    normalizeTeamName,
    registerBuzz,
    scoreBuzzedTeam,
};
