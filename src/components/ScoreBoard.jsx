function ScoreBoard({
  teamScore,
  puzzlesSolved,
  hintsUsed,
}) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-item">
        <span>🏆</span>
        <div>
          <strong>{teamScore}</strong>
          <p>Team Score</p>
        </div>
      </div>

      <div className="scoreboard-item">
        <span>🧩</span>
        <div>
          <strong>{puzzlesSolved}</strong>
          <p>Puzzles Solved</p>
        </div>
      </div>

      <div className="scoreboard-item">
        <span>💡</span>
        <div>
          <strong>{hintsUsed}</strong>
          <p>Hints Used</p>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;