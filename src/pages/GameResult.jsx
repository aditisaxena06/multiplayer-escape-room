import {
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ScoreBoard from "../components/ScoreBoard";
import PlayerContribution from "../components/PlayerContribution";

import { GameContext } from "../context/GameContext";

import {
  getGameResult,
  getPlayerContributions,
} from "../services/api";


function GameResult() {
  const navigate = useNavigate();

  const {
    user,
    room,
    resetGame,
  } = useContext(GameContext);

  const [result, setResult] = useState(null);
  const [contributionData, setContributionData] =
  useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!room?._id) {
      setError("Room information is missing.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login session expired.");
      setIsLoading(false);
      return;
    }

    const loadResult = async () => {
      try {
        setIsLoading(true);
        setError("");

        /*
         * GameResult is the authoritative source
         * for the completed game.
         */
        const resultResponse = await getGameResult(
          room._id,
          token
        );

        const backendResult =
          resultResponse.result;

        if (!backendResult) {
          throw new Error(
            "No game result was returned by the server."
          );
        }

        console.log(
          "🏆 BACKEND GAME RESULT:",
          backendResult
        );

        setResult(backendResult);


        /*
         * Load player contribution data separately.
         *
         * The backend calculates contribution
         * from the latest GameSession and its
         * PuzzleAttempt records.
         */
        try {
          const contributionResponse =
            await getPlayerContributions(
              room._id,
              token
            );

          console.log(
            "📊 PLAYER CONTRIBUTIONS:",
            contributionResponse.contributions
          );

          setContributionData(
            contributionResponse.contributions || null
          );
        } catch (contributionError) {
          console.error(
            "Contribution loading error:",
            contributionError
          );

          setContributionData(null);
        }

      } catch (err) {
        console.error(
          "Result loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load result."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();

  }, [room?._id]);


  if (isLoading) {
    return (
      <div className="result-page">
        <Navbar />

        <main className="result-container">
          <div className="result-card">
            <h2>
              Loading result...
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
              Unable to load result
            </h2>

            <p>
              {error}
            </p>

            <button
              className="secondary-btn"
              onClick={() =>
                navigate("/lobby")
              }
            >
              Return to Lobby
            </button>
          </div>
        </main>
      </div>
    );
  }


  /*
   * ==========================================
   * AUTHORITATIVE GAME RESULT
   * ==========================================
   *
   * These values come from GameResult,
   * which was created from GameSession.
   */

  const teamScore =
    Number(result?.totalScore) || 0;

  const puzzlesSolved =
    Number(result?.puzzlesSolved) || 0;

  const hintsUsed =
    Number(result?.hintsUsed) || 0;

  const durationSeconds =
    Number(result?.durationSeconds) || 0;

  const isSuccess =
    result?.status === "completed";


  /*
   * Player list is used only for contribution
   * display and player count.
   */
  const players =
    contributionData?.contributions || [];


  const formatTime = (seconds) => {
    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };


  /*
   * Current player's contribution.
   *
   * If the backend score endpoint provides it,
   * use it. Otherwise don't display stale data
   * from GameContext.
   */
  const currentPlayer =
    players.find(
      (player) =>
        player.userId?.toString() ===
        user?._id?.toString()
    );

  const playerContribution =
    currentPlayer?.score ?? 0;


  const handleReplay = () => {
    resetGame();
    navigate("/lobby");
  };


  const handleLobby = () => {
    resetGame();
    navigate("/lobby");
  };


  return (
    <div className="result-page">
      <Navbar />

      <main className="result-container">

        <div className="result-card">

          <div className="result-icon">
            {isSuccess
              ? "🏆"
              : "⏰"}
          </div>


          <p className="section-label">
            {isSuccess
              ? "ESCAPE COMPLETE"
              : "GAME OVER"}
          </p>


          <h1>
            {isSuccess
              ? "You Escaped!"
              : "Time's Up!"}
          </h1>


          <p className="result-description">
            {isSuccess
              ? "Congratulations! Your team solved the puzzles and successfully escaped the room."
              : "Your team ran out of time before solving all the puzzles. Better luck next time!"}
          </p>


          <ScoreBoard
            teamScore={teamScore}
            puzzlesSolved={puzzlesSolved}
            hintsUsed={hintsUsed}
          />


          <div className="result-stats">

            <div className="result-stat">
              <span>⏱️</span>

              <strong>
                {formatTime(
                  durationSeconds
                )}
              </strong>

              <p>
                Completion Time
              </p>
            </div>


            <div className="result-stat">
              <span>⭐</span>

              <strong>
                {playerContribution}
              </strong>

              <p>
                Your Contribution
              </p>
            </div>


            <div className="result-stat">
              <span>👥</span>

              <strong>
                {players.length}
              </strong>

              <p>
                Players
              </p>
            </div>

          </div>


          <div className="contributions-section">

            <div className="contributions-heading">

              <div>

                <p className="section-label">
                  TEAM PERFORMANCE
                </p>

                <h2>
                  ⭐ Player Contributions
                </h2>

              </div>

            </div>


            <div className="contributions-list">

              {players.length > 0 ? (
                players.map((player) => (
                  <PlayerContribution
                    key={player.userId}
                    playerName={player.name}
                    avatar={player.avatar || "🎮"}
                    points={player.score || 0}
                    maxPoints={teamScore || 100}
                  />
                ))
              ) : (
                <p>
                  Player contribution data
                  is not available.
                </p>
              )}

            </div>

          </div>


          <div
            className={`result-message ${
              isSuccess
                ? "success-message"
                : "failure-message"
            }`}
          >
            {isSuccess
              ? "🎉 Excellent teamwork! You found the way out."
              : "💪 Don't give up! Try again and escape faster."}
          </div>


          <div className="result-buttons">

            <button
              className="primary-btn"
              onClick={
                handleReplay
              }
            >
              🔄 Replay Game
            </button>


            <button
              className="secondary-btn"
              onClick={
                handleLobby
              }
            >
              🚪 Return to Lobby
            </button>


            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/leaderboard"
                )
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

export default GameResult;