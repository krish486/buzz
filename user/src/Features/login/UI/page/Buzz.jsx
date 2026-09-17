import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { socket } from "../../../../lib/socket";

const Buzz = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const teamName = location.state?.teamName;
    const roomId = location.state?.roomId;

    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState("waiting"); // waiting | buzzed | correct | incorrect
    const [buzzedTeam, setBuzzedTeam] = useState(null);
    const [error, setError] = useState(null);

    // Kick back to login if this page was reached without joining first
    useEffect(() => {
        if (!teamName || !roomId) {
            navigate("/", { replace: true });
        }
    }, [teamName, roomId, navigate]);

    useEffect(() => {
        if (!teamName || !roomId) return;

        const applyState = (state) => {
            setStatus(state.status);
            setBuzzedTeam(state.buzzedTeam);
        };

        const handleConnect = () => {
            setConnected(true);

            socket.emit("join-room", { roomId, teamName }, (res) => {
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
    }, [teamName, roomId]);

    const buzzed = status !== "waiting";
    const isThisTeam = buzzedTeam === teamName;

    const handleBuzz = () => {
        if (buzzed) return;
        socket.emit("buzz");
    };

    if (!teamName || !roomId) return null;

    return (
        <div className="min-h-screen bg-[#090b0d] text-white">

            {/* ================= HEADER ================= */}

            <header className="
                flex
                items-center
                justify-between
                border-b
                border-zinc-800
                px-6
                py-5
                lg:px-10
            ">

                <div>

                    <p className="
                        text-[9px]
                        tracking-[0.3em]
                        text-zinc-500
                    ">
                        MATHOPIA • ROUND 2
                    </p>

                    <h1 className="
                        mt-1
                        text-lg
                        font-black
                        tracking-wider
                    ">
                        BUZZER
                    </h1>

                </div>


                {/* CONNECTION STATUS */}

                <div className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-4
                    py-2
                ">

                    <span className={`
                        h-2
                        w-2
                        rounded-full
                        ${connected
                            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                            : "bg-red-400"
                        }
                    `} />

                    <span className="
                        text-[9px]
                        font-bold
                        tracking-widest
                        text-zinc-400
                    ">
                        {connected ? "CONNECTED" : "CONNECTING..."}
                    </span>

                </div>

            </header>

            {error && (
                <p className="px-6 pt-4 text-xs font-semibold tracking-wide text-red-400 lg:px-10">
                    {error}
                </p>
            )}


            {/* ================= MAIN ================= */}

            <main className="
                flex
                min-h-[calc(100vh-145px)]
                flex-col
                items-center
                justify-center
                px-6
            ">


                {/* TEAM INFORMATION */}

                <div className="mb-10 text-center">

                    <p className="
                        text-[10px]
                        font-semibold
                        tracking-[0.3em]
                        text-zinc-600
                    ">
                        TEAM
                    </p>

                    <h2 className="
                        mt-2
                        text-4xl
                        font-black
                        tracking-[0.15em]
                    ">
                        {teamName}
                    </h2>

                    <p className="
                        mt-3
                        text-xs
                        text-zinc-600
                    ">
                        Press the button when you know the answer
                    </p>

                </div>


                {/* ================= 3D BUZZER ================= */}

                <div className="relative">


                    {/* OUTER GLOW */}

                    <div className="
                        absolute
                        inset-0
                        rounded-full
                        bg-zinc-500/10
                        blur-3xl
                        scale-110
                    " />


                    {/* OUTER BASE */}

                    <div className="
                        relative
                        flex
                        h-[310px]
                        w-[310px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-zinc-700
                        bg-[#15191d]
                        shadow-[0_25px_50px_rgba(0,0,0,0.7)]
                        sm:h-[380px]
                        sm:w-[380px]
                    ">


                        {/* BASE RING */}

                        <div className="
                            absolute
                            inset-[15px]
                            rounded-full
                            border
                            border-zinc-800
                            bg-[#0d1012]
                            shadow-[inset_0_8px_20px_rgba(0,0,0,0.8)]
                        " />


                        {/* BUTTON BASE */}

                        <button
                            onClick={handleBuzz}
                            disabled={buzzed || !connected}
                            className={`
                                group
                                relative
                                z-10
                                flex
                                h-[225px]
                                w-[225px]
                                items-center
                                justify-center
                                rounded-full
                                border-[8px]
                                border-zinc-800
                                transition-all
                                duration-100

                                sm:h-[285px]
                                sm:w-[285px]

                                ${buzzed
                                    ? `
                                            cursor-not-allowed
                                            bg-zinc-500
                                            shadow-[inset_0_12px_20px_rgba(0,0,0,0.35)]
                                          `
                                    : `
                                            bg-zinc-200
                                            shadow-[0_12px_0_#777,0_20px_30px_rgba(0,0,0,0.6)]
                                            hover:bg-white
                                            hover:-translate-y-1
                                            active:translate-y-[8px]
                                            active:shadow-[0_4px_0_#777,0_8px_15px_rgba(0,0,0,0.5)]
                                          `
                                }
                            `}
                        >

                            {/* INNER BUTTON */}

                            <div className="
                                flex
                                h-[75%]
                                w-[75%]
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-zinc-300
                                bg-gradient-to-b
                                from-zinc-100
                                to-zinc-300
                                shadow-[inset_0_5px_10px_rgba(255,255,255,0.8)]
                            ">

                                <span className="
                                    text-2xl
                                    font-black
                                    tracking-[0.15em]
                                    text-zinc-800
                                    sm:text-3xl
                                ">
                                    {isThisTeam ? "BUZZED" : buzzed ? "LOCKED" : "BUZZ"}
                                </span>

                            </div>

                        </button>

                    </div>

                </div>


                {/* ================= STATUS ================= */}

                <div className="mt-10 text-center">

                    {isThisTeam ? (

                        <>
                            <div className="
                                flex
                                items-center
                                justify-center
                                gap-2
                            ">

                                <span className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-400
                                    shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                                />

                                <span className="
                                    text-xs
                                    font-bold
                                    tracking-[0.2em]
                                text-emerald-400
                                ">
                                    BUZZ REGISTERED
                                </span>

                            </div>

                            <p className="
                                mt-2
                                text-xs
                                text-zinc-600
                            ">
                                Wait for the host
                            </p>
                        </>

                    ) : buzzed ? (

                        <>
                            <p className="
                                text-xs
                                font-semibold
                                tracking-[0.15em]
                                text-zinc-500
                            ">
                                {buzzedTeam} BUZZED FIRST
                            </p>

                            <p className="
                                mt-2
                                text-[10px]
                                text-zinc-700
                            ">
                                Wait for the host to clear the buzzer
                            </p>
                        </>

                    ) : (

                        <>
                            <p className="
                                text-xs
                                font-semibold
                                tracking-[0.15em]
                                text-zinc-500
                            ">
                                READY TO BUZZ
                            </p>

                            <p className="
                                mt-2
                                text-[10px]
                                text-zinc-700
                            ">
                                Your first press will be registered
                            </p>
                        </>

                    )}

                </div>

            </main >

        </div >
    );
};

export default Buzz;
