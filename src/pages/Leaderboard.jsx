import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";
import { getLeaderboard } from "../services/api";

function Leaderboard() {
  const { user, token, room } = useContext(GameContext);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!token) {
        setError("Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        if (!room?._id) {
          setError("Room information is missing.");
          setIsLoading(false);
          return;
        }

        const data = await getLeaderboard(
          room._id,
          token
        );

        setLeaderboardData(data.leaderboard || []);
      } catch (error) {
        console.error("Leaderboard error:", error);
        setError(
          error.message || "Failed to load leaderboard."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [token, room?._id]);

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";

    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <Navbar />

      <main className="leaderboard-container">
        <div className="leaderboard-header">
          <p className="section-label">
            TEAM RANKINGS
          </p>

          <h1>🏆 Leaderboard</h1>

          <p>
            See how players performed across
            completed puzzles.
          </p>
        </div>

        <div className="leaderboard-card">

          {/* HEADER */}
          <div className="leaderboard-top">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Puzzles</span>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div className="leaderboard-empty">
              Loading leaderboard...
            </div>
          )}

          {/* ERROR */}
          {!isLoading && error && (
            <div className="leaderboard-empty">
              ⚠️ {error}
            </div>
          )}

          {/* EMPTY */}
          {!isLoading &&
            !error &&
            leaderboardData.length === 0 && (
              <div className="leaderboard-empty">
                No scores available yet.
              </div>
            )}

          {/* REAL LEADERBOARD */}
          {!isLoading &&
            !error &&
            leaderboardData.map((player, index) => {
              const rank = index + 1;

              const isCurrentPlayer =
                player.userId?.toString() ===
                user?._id?.toString();

              return (
                <div
                  key={player.userId}
                  className={`leaderboard-row ${
                    isCurrentPlayer
                      ? "current-player"
                      : ""
                  }`}
                >

                  {/* RANK */}
                  <div className="player-rank">
                    {getRankIcon(rank)}
                  </div>

                  {/* PLAYER */}
                  <div className="leaderboard-player">
                    <div className="leaderboard-avatar">
                      {player.avatar || "🎮"}
                    </div>

                    <div>
                      <strong>
                        {player.name}
                      </strong>

                      {isCurrentPlayer && (
                        <span className="you-label">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SCORE */}
                  <div className="leaderboard-score">
                    {player.totalScore}
                  </div>

                  {/* PUZZLES */}
                  <div>
                    {player.puzzlesSolved}/5
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;