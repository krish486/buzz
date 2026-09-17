import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// autoConnect is off so components control connect/disconnect explicitly
export const socket = io(SOCKET_URL, {
    autoConnect: false,
});
