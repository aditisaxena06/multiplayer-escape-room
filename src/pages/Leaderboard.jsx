import { useContext } from "react";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function Leaderboard() {
  const { user, teamScore, puzzlesSolved } = useContext(GameContext);

  const playerName = user?.name || "Player One";

  const leaderboardData = [
    {
      rank: 1,
      name: "Alex",
      avatar: "🧑‍🚀",
      score: 950,
      puzzles: 5,
      time: "3:42",
    },
    {
      rank: 2,
      name: playerName,
      avatar: user?.avatar || "🎮",
      score: teamScore || 500,
      puzzles: puzzlesSolved || 5,
      time: "4:18",
    },
    {
      rank: 3,
      name: "Rahul",
      avatar: "🕵️",
      score: 450,
      puzzles: 4,
      time: "4:36",
    },
    {
      rank: 4,
      name: "Priya",
      avatar: "🧩",
      score: 400,
      puzzles: 4,
      time: "4:51",
    },
    {
      rank: 5,
      name: "Sam",
      avatar: "🧑‍💻",
      score: 350,
      puzzles: 3,
      time: "5:00",
    },
  ];

  return (
    <div className="leaderboard-page">
      <Navbar />

      <main className="leaderboard-container">
        <div className="leaderboard-header">
          <p className="section-label">TEAM RANKINGS</p>

          <h1>🏆 Leaderboard</h1>

          <p>
            See how your team performed against other escape room players.
          </p>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-top">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Puzzles</span>
            <span>Time</span>
          </div>

          {leaderboardData.map((player) => {
            const isCurrentPlayer = player.name === playerName;

            return (
              <div
                key={`${player.rank}-${player.name}`}
                className={`leaderboard-row ${
                  isCurrentPlayer ? "current-player" : ""
                }`}
              >
                <div className="player-rank">
                  {player.rank === 1
                    ? "🥇"
                    : player.rank === 2
                    ? "🥈"
                    : player.rank === 3
                    ? "🥉"
                    : `#${player.rank}`}
                </div>

                <div className="leaderboard-player">
                  <div className="leaderboard-avatar">
                    {player.avatar}
                  </div>

                  <div>
                    <strong>{player.name}</strong>

                    {isCurrentPlayer && (
                      <span className="you-label">YOU</span>
                    )}
                  </div>
                </div>

                <div className="leaderboard-score">
                  {player.score}
                </div>

                <div>{player.puzzles}/5</div>

                <div>{player.time}</div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;