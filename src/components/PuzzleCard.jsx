function PuzzleCard({
  answer,
  setAnswer,
  message,
  puzzleSolved,
  timeLeft,
  onSubmit,
}) {
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);

    if (!puzzleSolved && timeLeft > 0) {
      // The parent handles the actual message state.
      // This keeps the input behavior consistent.
    }
  };

  return (
    <form className="answer-section" onSubmit={onSubmit}>
      <label>Your Answer</label>

      <div className="answer-row">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          aria-label="Puzzle answer"
          autoComplete="off"
        />

        <button
          type="submit"
          className="submit-answer-btn"
          disabled={puzzleSolved || timeLeft <= 0}
        >
          {puzzleSolved ? "Solved ✓" : "Submit Answer"}
        </button>
      </div>

      {message && (
        <p
          className={
            puzzleSolved
              ? "correct-message"
              : "wrong-message"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default PuzzleCard;