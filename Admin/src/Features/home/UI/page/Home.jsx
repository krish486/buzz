import { useEffect, useState } from "react";

import BuzzScreen from "../components/BuzzScreen";
import Controls from "../components/Controls";
import LeaderBoard from "../components/LeaderBoard";
import { socket } from "../../../../lib/socket";

const ROOM_ID = import.meta.env.VITE_ROOM_ID;

const Home = () => {

    const [teams, setTeams] = useState([]);

    const [buzzedTeam, setBuzzedTeam] = useState(null);

    const [status, setStatus] = useState("waiting");

    const [connected, setConnected] = useState(false);

    const [error, setError] = useState(null);


    // =========================
    // SOCKET LIFECYCLE
    // =========================

    useEffect(() => {

        const applyState = (state) => {
            setTeams(state.teams);
            setBuzzedTeam(state.buzzedTeam);
            setStatus(state.status);
        };

        const handleConnect = () => {
            setConnected(true);

            socket.emit("join-admin", { roomId: ROOM_ID }, (res) => {
                if (res?.ok) {
                    setError(null);
                    applyState(res.state);
                } else {
                    setError(res?.message || "Unable to join room");
                }
            });
        };

        const handleDisconnect = () => setConnected(false);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("room-state", applyState);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("room-state", applyState);
            socket.disconnect();
        };

    }, []);


    // =========================
    // ADMIN ACTIONS
    // =========================

    const handleCorrect = () => {
        socket.emit("mark-correct");
    };

    const handleIncorrect = () => {
        socket.emit("mark-incorrect");
    };

    const clearBuzz = () => {
        socket.emit("clear-buzz");
    };


    return (

        <div className="min-h-screen bg-[#090b0d] px-6 py-6 text-white lg:px-10">

            {/* ================= HEADER ================= */}

            <header className="flex items-center justify-between border-b border-zinc-800 pb-5">

                <div>

                    <p className="text-[10px] tracking-[0.3em] text-zinc-500">
                        MATHOPIA • ROUND 2
                    </p>

                    <h1 className="mt-1 text-2xl font-extrabold tracking-wide">
                        BUZZER CONTROL
                    </h1>

                </div>

                {/* CONNECTION STATUS */}

                <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">

                    <span
                        className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-red-400"
                            }`}
                    />

                    <span className="text-[9px] font-bold tracking-widest text-zinc-400">
                        {connected ? "CONNECTED" : "DISCONNECTED"}
                    </span>

                </div>

            </header>

            {error && (
                <p className="mt-3 text-xs font-semibold tracking-wide text-red-400">
                    {error}
                </p>
            )}


            {/* ================= DASHBOARD ================= */}

            <main className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.8fr_1fr]">


                {/* ================= BUZZ SCREEN ================= */}

                <BuzzScreen

                    buzzedTeam={buzzedTeam}

                    status={status}

                />


                {/* ================= CONTROLS ================= */}

                <Controls

                    buzzedTeam={buzzedTeam}

                    status={status}

                    onCorrect={handleCorrect}

                    onIncorrect={handleIncorrect}

                    onClear={clearBuzz}

                />


                {/* ================= LEADERBOARD ================= */}

                <LeaderBoard

                    teams={teams}

                    buzzedTeam={buzzedTeam}

                />

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="mt-5 flex flex-col justify-between gap-2 border-t border-zinc-800 pt-4 text-[9px] tracking-[0.2em] text-zinc-600 sm:flex-row">

                <span>
                    ADMIN CONSOLE
                </span>

                <span>
                    BUZZER SYSTEM • {connected ? "READY" : "OFFLINE"}
                </span>

            </footer>

        </div>
    );
};

export default Home;
