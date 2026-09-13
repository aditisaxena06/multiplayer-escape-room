import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getGameHistory,
  getPlayerStatistics,
} from "../services/api";


function GameHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");


  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setError("Login session expired.");
      setIsLoading(false);
      return;
    }


    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          historyResponse,
          statisticsResponse,
        ] = await Promise.all([
          getGameHistory(token),
          getPlayerStatistics(token),
        ]);

        setHistory(
          historyResponse.history || []
        );

        setStatistics(
          statisticsResponse.statistics || null
        );

      } catch (err) {
        console.error(
          "Game history loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load game history."
        );
      } finally {
        setIsLoading(false);
      }
    };


    loadData();
  }, []);


  const formatTime = (seconds) => {
    const totalSeconds =
      Number(seconds) || 0;

    const mins =
      Math.floor(totalSeconds / 60);

    const secs =
      totalSeconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };


  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleString();
  };


  if (isLoading) {
    return (
      <div className="result-page">
        <Navbar />

        <main className="result-container">
          <div className="result-card">
            <h2>
              Loading game history...
            </h2>
          </div>
        </main>
      </div>
    );
  }


  if (error) {
    return (
      <div className="result-page">
        <Navbar />

        <main className="result-container">
          <div className="result-card">
            <h2>
              Unable to load history
            </h2>

            <p>{error}</p>

            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Return to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="result-page">
      <Navbar />

      <main className="result-container">

        <div className="result-card">

          <p className="section-label">
            PLAYER PROFILE
          </p>

          <h1>
            Game History
          </h1>

          <p className="result-description">
            View your previous games and
            overall escape-room statistics.
          </p>


          {/* ================================
              PLAYER STATISTICS
          ================================= */}

          {statistics && (
            <div className="result-stats">

              <div className="result-stat">
                <span>🎮</span>

                <strong>
                  {statistics.gamesPlayed}
                </strong>

                <p>
                  Games Played
                </p>
              </div>


              <div className="result-stat">
                <span>🏆</span>

                <strong>
                  {statistics.gamesCompleted}
                </strong>

                <p>
                  Games Completed
                </p>
              </div>


              <div className="result-stat">
                <span>⭐</span>

                <strong>
                  {statistics.bestScore}
                </strong>

                <p>
                  Best Score
                </p>
              </div>


              <div className="result-stat">
                <span>🧩</span>

                <strong>
                  {statistics.totalPuzzlesSolved}
                </strong>

                <p>
                  Puzzles Solved
                </p>
              </div>


              <div className="result-stat">
                <span>💯</span>

                <strong>
                  {statistics.averageScore}
                </strong>

                <p>
                  Average Score
                </p>
              </div>


              <div className="result-stat">
                <span>⏱️</span>

                <strong>
                  {formatTime(
                    statistics.averageCompletionTime
                  )}
                </strong>

                <p>
                  Avg. Completion
                </p>
              </div>

            </div>
          )}


          {/* ================================
              GAME HISTORY
          ================================= */}

          <div className="contributions-section">

            <div className="contributions-heading">

              <div>

                <p className="section-label">
                  PREVIOUS GAMES
                </p>

                <h2>
                  📜 Game History
                </h2>

              </div>

            </div>


            {history.length > 0 ? (

              <div className="contributions-list">

                {history.map((game) => {

                  const isCompleted =
                    game.status ===
                    "completed";

                  return (
                    <div
                      className="history-item"
                      key={game._id}
                    >

                      <div>
                        <strong>
                          {game.room?.code ||
                            "Unknown Room"}
                        </strong>

                        <p>
                          {formatDate(
                            game.completedAt
                          )}
                        </p>
                      </div>


                      <div>
                        <strong>
                          {isCompleted
                            ? "🏆 Completed"
                            : "⏰ Failed"}
                        </strong>

                        <p>
                          {game.puzzlesSolved}
                          /5 puzzles
                        </p>
                      </div>


                      <div>
                        <strong>
                          ⭐{" "}
                          {game.totalScore}
                        </strong>

                        <p>
                          💡{" "}
                          {game.hintsUsed} hints
                        </p>
                      </div>


                      <div>
                        <strong>
                          ⏱️{" "}
                          {formatTime(
                            game.durationSeconds
                          )}
                        </strong>

                        <p>
                          Game time
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              <p>
                You have not played any
                games yet.
              </p>

            )}

          </div>


          {/* ================================
              EXTRA STATISTICS
          ================================= */}

          {statistics && (
            <div className="result-message success-message">

              🎯 You have played{" "}
              {statistics.gamesPlayed} games,
              completed{" "}
              {statistics.gamesCompleted},
              and earned{" "}
              {statistics.totalScore} total points.

            </div>
          )}


          <div className="result-buttons">

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              🏠 Dashboard
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/leaderboard")
              }
            >
              🏆 Leaderboard
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}


export default GameHistory;