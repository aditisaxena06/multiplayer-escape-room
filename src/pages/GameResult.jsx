import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";
import ScoreBoard from "../components/ScoreBoard";
import PlayerContribution from "../components/PlayerContribution";

function GameResult() {
  const navigate = useNavigate();

  const {
    user,
    room,
    gameStatus,
    puzzlesSolved,
    hintsUsed,
    teamScore,
    completionTime,
    playerContributions,
    resetGame,
  } = useContext(GameContext);

  const isSuccess = gameStatus === "completed";

  const totalPuzzles = 5;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playerName = user?.name || "Player One";
  const players = room?.players?.length
  ? room.players
  : [
      { name: playerName, avatar: user?.avatar || "🎮" },
      { name: "Alex", avatar: "🧑‍🚀" },
      { name: "Rahul", avatar: "🕵️" },
      { name: "Priya", avatar: "🧩" },
    ];

  const playerContribution =
    playerContributions?.[playerName] || 0;

  const handleReplay = () => {
    resetGame();
    navigate("/escape-room");
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

          {/* RESULT ICON */}
          <div className="result-icon">
            {isSuccess ? "🏆" : "⏰"}
          </div>

          {/* RESULT STATUS */}
          <p className="section-label">
            {isSuccess ? "ESCAPE COMPLETE" : "GAME OVER"}
          </p>

          <h1>
            {isSuccess ? "You Escaped!" : "Time's Up!"}
          </h1>

          <p className="result-description">
            {isSuccess
              ? "Congratulations! Your team solved the puzzles and successfully escaped the room."
              : "Your team ran out of time before solving all the puzzles. Better luck next time!"}
          </p>

          {/* GAME STATS */}
          <ScoreBoard
            teamScore={teamScore}
            puzzlesSolved={puzzlesSolved}
            hintsUsed={hintsUsed}
          />

          <div className="result-stats">
            <div className="result-stat">
              <span>⏱️</span>
              <strong>{formatTime(completionTime)}</strong>
              <p>Completion Time</p>
            </div>

            <div className="result-stat">
              <span>⭐</span>
              <strong>{playerContribution}</strong>
              <p>Your Contribution</p>
            </div>

            <div className="result-stat">
              <span>👥</span>
              <strong>{room?.players?.length || 4}</strong>
              <p>Players</p>
            </div>
          </div>

          {/* PLAYER CONTRIBUTIONS */}
          <div className="contributions-section">
            <div className="contributions-heading">
              <div>
                <p className="section-label">TEAM PERFORMANCE</p>
                <h2>⭐ Player Contributions</h2>
              </div>
            </div>

            <div className="contributions-list">
              {players.map((player) => {
                const points = playerContributions?.[player.name] || 0;

                return (
                  <PlayerContribution
                    key={player.name}
                    playerName={player.name}
                    avatar={player.avatar || "🎮"}
                    points={points}
                    maxPoints={teamScore || 100}
                  />
                );
              })}
            </div>
          </div>

          {/* TEAM MESSAGE */}
          <div
            className={`result-message ${
              isSuccess ? "success-message" : "failure-message"
            }`}
          >
            {isSuccess
              ? "🎉 Excellent teamwork! You found the way out."
              : "💪 Don't give up! Try again and escape faster."}
          </div>

          {/* BUTTONS */}
          <div className="result-buttons">

            <button
              className="primary-btn"
              onClick={handleReplay}
            >
              🔄 Replay Game
            </button>

            <button
              className="secondary-btn"
              onClick={handleLobby}
            >
              🚪 Return to Lobby
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/leaderboard")}
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