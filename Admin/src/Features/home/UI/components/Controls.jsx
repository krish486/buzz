const Controls = ({
    buzzedTeam,
    status,
    onCorrect,
    onIncorrect,
    onClear,
}) => {

    return (

        <section className="relative rounded-2xl border border-zinc-800 bg-[#111417] p-6">

            {/* TOP LINE */}

            <div className="absolute left-0 top-0 h-[2px] w-full bg-zinc-600" />


            {/* ================= HEADING ================= */}

            <div className="mb-6 flex gap-4">

                <span className="pt-1 text-[10px] font-bold text-zinc-600">
                    02
                </span>

                <div>

                    <h2 className="text-sm font-bold tracking-[0.2em]">
                        CONTROL
                    </h2>

                    <p className="mt-1 text-[11px] text-zinc-500">
                        Admin actions
                    </p>

                </div>

            </div>


            {/* ================= BUTTONS ================= */}

            <div className="space-y-3">


                {/* CORRECT */}

                <button
                    onClick={onCorrect}
                    disabled={
                        !buzzedTeam ||
                        status !== "buzzed"
                    }
                    className="
                        flex min-h-[80px] w-full
                        items-center gap-4
                        rounded-xl
                        border border-zinc-700
                        bg-zinc-900
                        px-5
                        text-left
                        transition-all

                        hover:-translate-y-0.5
                        hover:bg-zinc-800

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >

                    <span className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-lg
                        bg-zinc-800
                        text-xl
                        text-emerald-400
                    ">
                        ✓
                    </span>


                    <div>

                        <strong className="block text-sm tracking-wider">
                            CORRECT
                        </strong>

                        <small className="text-[9px] tracking-widest text-zinc-500">
                            +5 POINTS
                        </small>

                    </div>

                </button>


                {/* INCORRECT */}

                <button
                    onClick={onIncorrect}
                    disabled={
                        !buzzedTeam ||
                        status !== "buzzed"
                    }
                    className="
                        flex min-h-[80px] w-full
                        items-center gap-4
                        rounded-xl
                        border border-zinc-700
                        bg-zinc-900
                        px-5
                        text-left
                        transition-all

                        hover:-translate-y-0.5
                        hover:bg-zinc-800

                        disabled:cursor-not-allowed
                        disabled:opacity-30
                    "
                >

                    <span className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-lg
                        bg-zinc-800
                        text-xl
                        text-red-400
                    ">
                        ✕
                    </span>


                    <div>

                        <strong className="block text-sm tracking-wider">
                            INCORRECT
                        </strong>

                        <small className="text-[9px] tracking-widest text-zinc-500">
                            −5 POINTS
                        </small>

                    </div>

                </button>


                {/* CLEAR BUZZ */}

                <button
                    onClick={onClear}
                    className="
                        flex h-14 w-full
                        items-center justify-center
                        rounded-xl
                        border border-zinc-700
                        bg-transparent
                        text-xs font-bold
                        tracking-[0.15em]
                        text-zinc-400
                        transition-all

                        hover:bg-zinc-900
                        hover:text-white
                    "
                >

                    <span className="mr-2 text-lg">
                        ↻
                    </span>

                    CLEAR BUZZ

                </button>

            </div>


            {/* ================= CURRENT TEAM ================= */}

            <div className="
                mt-8
                rounded-xl
                border border-zinc-800
                bg-[#0c0f11]
                p-5
                text-center
            ">

                <span className="
                    block
                    text-[9px]
                    tracking-[0.25em]
                    text-zinc-600
                ">
                    CURRENT TEAM
                </span>


                <strong className="
                    mt-2
                    block
                    text-4xl
                    font-black
                    tracking-widest
                ">
                    {buzzedTeam || "—"}
                </strong>

            </div>

        </section>
    );
};

export default Controls;
