import Timer from "./Timer";

function GameHeader({
  roomName,
  timeLeft,
  currentPuzzle,
  totalPuzzles,
}) {
  return (
    <header className="game-header">
      <div className="game-title">
        <div className="game-icon">
          🏚️
        </div>

        <div>
          <p>ESCAPE ROOM</p>

          <h2>
            {roomName || "The Haunted Mansion"}
          </h2>
        </div>
      </div>

      <div className="game-top-info">
        <Timer timeLeft={timeLeft} />

        <div className="progress-box">
          <span>PUZZLES</span>

          <strong>
            {currentPuzzle} / {totalPuzzles}
          </strong>
        </div>
      </div>
    </header>
  );
}

export default GameHeader;