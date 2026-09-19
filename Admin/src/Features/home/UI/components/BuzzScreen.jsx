const BuzzScreen = ({
    buzzedTeam,
    status,
}) => {

    return (

        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#111417] p-6">

            {/* TOP LINE */}

            <div className="absolute left-0 top-0 h-[2px] w-full bg-zinc-600" />


            {/* ================= HEADING ================= */}

            <div className="mb-6 flex gap-4">

                <span className="pt-1 text-[10px] font-bold text-zinc-600">
                    01
                </span>

                <div>

                    <h2 className="text-sm font-bold tracking-[0.2em]">
                        BUZZER
                    </h2>

                    <p className="mt-1 text-[11px] text-zinc-500">
                        First team to press the buzzer
                    </p>

                </div>

            </div>


            {/* ================= BUZZ DISPLAY ================= */}

            <div
                className={`
                    flex h-[265px]
                    flex-col items-center justify-center
                    rounded-2xl
                    border border-dashed
                    bg-[#0c0f11]
                    text-center
                    transition-all duration-300

                    ${status === "buzzed"
                        ? "border-zinc-400 shadow-[inset_0_0_50px_rgba(255,255,255,0.03)]"
                        : ""
                    }

                    ${status === "correct"
                        ? "border-emerald-400"
                        : ""
                    }

                    ${status === "incorrect"
                        ? "border-red-400"
                        : ""
                    }
                `}
            >

                {buzzedTeam ? (

                    <>
                        {/* STATUS */}

                        <span className="mb-2 text-[10px] tracking-[0.3em] text-zinc-500">

                            {status === "buzzed"
                                ? "BUZZED"
                                : status === "correct"
                                    ? "CORRECT"
                                    : "INCORRECT"
                            }

                        </span>


                        {/* TEAM */}

                        <strong className="text-7xl font-black tracking-[0.15em]">
                            {buzzedTeam}
                        </strong>


                        {/* MESSAGE */}

                        <span className="mt-4 text-xs text-zinc-500">

                            {status === "buzzed" &&
                                "Team has the opportunity to answer"
                            }

                            {status === "correct" &&
                                "Correct answer • +3 points"
                            }

                            {status === "incorrect" &&
                                "Incorrect answer • −2 points"
                            }

                        </span>

                    </>

                ) : (

                    <>
                        <span className="mb-3 text-5xl text-zinc-700">
                            ○
                        </span>

                        <strong className="text-3xl font-bold tracking-[0.15em] text-zinc-600">
                            WAITING
                        </strong>

                        <span className="mt-3 text-xs text-zinc-600">
                            Waiting for a team to buzz
                        </span>
                    </>

                )}

            </div>

        </section>
    );
};

export default BuzzScreen;
