const LeaderBoard = ({
    teams,
    buzzedTeam,
}) => {

    const sortedTeams = [...teams].sort(
        (a, b) => b.score - a.score
    );


    return (

        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#111417] p-6">

            {/* TOP LINE */}

            <div className="absolute left-0 top-0 h-0.5 w-full bg-zinc-600" />


            {/* ================= HEADING ================= */}

            <div className="mb-6 flex gap-4">

                <span className="pt-1 text-[10px] font-bold text-zinc-600">
                    03
                </span>

                <div>

                    <h2 className="text-sm font-bold tracking-[0.2em]">
                        LEADERBOARD
                    </h2>

                    <p className="mt-1 text-[11px] text-zinc-500">
                        Live standings
                    </p>

                </div>

            </div>


            {/* ================= TEAMS ================= */}

            <div className="space-y-2">

                {sortedTeams.map((team, index) => (

                    <div
                        key={team.id}
                        className={`
                            grid
                            grid-cols-[35px_1fr_auto]
                            items-center
                            rounded-xl
                            border
                            px-4
                            transition-all

                            ${team.name === buzzedTeam
                                ? "border-zinc-500 bg-zinc-800/70"
                                : "border-transparent bg-zinc-900"
                            }
                        `}
                    >

                        {/* RANK */}

                        <span className="text-xs font-bold text-zinc-600">
                            {String(index + 1).padStart(2, "0")}
                        </span>


                        {/* TEAM */}

                        <div className="flex items-center gap-2">

                            <span className="text-sm font-bold tracking-wider">
                                {team.name}
                            </span>


                            {team.name === buzzedTeam && (

                                <span className="
                                    rounded
                                    bg-zinc-700
                                    px-1.5 py-0.5
                                    text-[7px]
                                    tracking-wider
                                    text-zinc-300
                                ">
                                    BUZZED
                                </span>

                            )}

                        </div>


                        {/* SCORE */}

                        <div className="text-right">

                            <span className="text-xl font-black">
                                {team.score}
                            </span>

                            <span className="
                                ml-1
                                text-[7px]
                                tracking-widest
                                text-zinc-600
                            ">
                                PTS
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default LeaderBoard;
