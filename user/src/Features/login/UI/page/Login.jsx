import { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = () => {
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!teamName.trim() || !roomId.trim()) {
            setError("Enter both a team name and room ID");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/app/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: teamName.trim(), roomId: roomId.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Unable to join room");
                return;
            }

            navigate("/user", {
                state: {
                    teamName: teamName.trim(),
                    roomId: roomId.trim(),
                },
            });
        } catch {
            setError("Could not reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090b0d] text-white flex items-center justify-center px-6">

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[500px]
                    w-[500px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-zinc-700/10
                    blur-3xl
                " />

            </div>


            {/* LOGIN CARD */}

            <form
                onSubmit={handleSubmit}
                className="
                relative
                w-full
                max-w-md
                overflow-hidden
                rounded-2xl
                border
                border-zinc-800
                bg-[#111417]
                p-8
                shadow-2xl
            ">

                {/* Top line */}

                <div className="
                    absolute
                    left-0
                    top-0
                    h-[2px]
                    w-full
                    bg-zinc-500
                " />


                {/* HEADER */}

                <div className="text-center">

                    {/* Logo */}

                    <div className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-zinc-700
                        bg-zinc-900
                        text-xl
                        font-black
                        tracking-widest
                    ">
                        M
                    </div>


                    <p className="
                        mt-5
                        text-[10px]
                        font-semibold
                        tracking-[0.35em]
                        text-zinc-500
                    ">
                        MATHOPIA • ROUND 2
                    </p>


                    <h1 className="
                        mt-2
                        text-3xl
                        font-black
                        tracking-wide
                    ">
                        TEAM LOGIN
                    </h1>


                    <p className="
                        mt-2
                        text-sm
                        text-zinc-500
                    ">
                        Join the buzzer room to participate
                    </p>

                </div>


                {/* FORM */}

                <div className="mt-8 space-y-5">


                    {/* TEAM NAME */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[10px]
                            font-semibold
                            tracking-[0.2em]
                            text-zinc-500
                        ">
                            TEAM NAME
                        </label>


                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-zinc-700
                                bg-[#0c0f11]
                                px-4
                                py-4
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-zinc-700

                                transition-all

                                focus:border-zinc-400
                                focus:ring-1
                                focus:ring-zinc-500
                            "
                        />

                    </div>


                    {/* ROOM ID */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[10px]
                            font-semibold
                            tracking-[0.2em]
                            text-zinc-500
                        ">
                            ROOM ID
                        </label>


                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter room ID..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-zinc-700
                                bg-[#0c0f11]
                                px-4
                                py-4
                                text-sm
                                uppercase
                                tracking-widest
                                text-white
                                outline-none
                                placeholder:normal-case
                                placeholder:tracking-normal
                                placeholder:text-zinc-700

                                transition-all

                                focus:border-zinc-400
                                focus:ring-1
                                focus:ring-zinc-500
                            "
                        />

                    </div>


                    {error && (
                        <p className="text-xs font-semibold tracking-wide text-red-400">
                            {error}
                        </p>
                    )}


                    {/* JOIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            mt-2
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-white
                            px-5
                            py-4
                            text-sm
                            font-bold
                            tracking-wider
                            text-black

                            transition-all

                            hover:bg-zinc-200
                            hover:-translate-y-0.5
                            active:translate-y-0

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading ? "JOINING..." : "JOIN ROOM"}

                        {!loading && (
                            <span className="text-lg">
                                →
                            </span>
                        )}

                    </button>

                </div>


                {/* STATUS */}

                <div className="
                    mt-7
                    flex
                    items-center
                    justify-center
                    gap-2
                    border-t
                    border-zinc-800
                    pt-5
                ">

                    <span className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-emerald-400
                    " />

                    <span className="
                        text-[9px]
                        tracking-[0.2em]
                        text-zinc-600
                    ">
                        BUZZER SYSTEM READY
                    </span>

                </div>

            </form>

        </div>
    );
};

export default Login;
