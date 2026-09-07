function NextPuzzle({
  currentPuzzle,
  totalPuzzles,
  puzzleSolved,
  handleNextPuzzle,
}) {
  if (!puzzleSolved) {
    return null;
  }

  return (
    <section className="next-puzzle-section">
      <div className="next-puzzle-content">
        <div className="next-puzzle-icon">🔓</div>

        <div>
          <p className="section-label">PUZZLE SOLVED</p>
          <h2>
            {currentPuzzle < totalPuzzles
              ? "Ready for the next clue?"
              : "All puzzles solved!"}
          </h2>

          <p>
            {currentPuzzle < totalPuzzles
              ? "Your team unlocked the next puzzle."
              : "Your team has escaped the room!"}
          </p>
        </div>

        <button
          type="button"
          className="next-puzzle-btn"
          onClick={handleNextPuzzle}
        >
          {currentPuzzle < totalPuzzles
            ? "Next Puzzle →"
            : "View Results →"}
        </button>
      </div>
    </section>
  );
}

export default NextPuzzle;