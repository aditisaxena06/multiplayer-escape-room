function PuzzleCard({
  answer,
  setAnswer,
  timeLeft,
  onSubmit,
  isSubmitting = false,
}) {
  const isTimeUp = timeLeft <= 0;

  return (
    <form
      className="answer-section"
      onSubmit={onSubmit}
    >
      <label htmlFor="puzzle-answer">
        Your Answer
      </label>

      <div className="answer-row">
        <input
          id="puzzle-answer"
          type="text"
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder={
            isTimeUp
              ? "Time is up"
              : "Enter your answer"
          }
          aria-label="Puzzle answer"
          autoComplete="off"
          disabled={
            isSubmitting || isTimeUp
          }
        />

        <button
          type="submit"
          className="submit-answer-btn"
          disabled={
            isSubmitting ||
            isTimeUp ||
            !answer.trim()
          }
        >
          {isSubmitting
            ? "Checking..."
            : isTimeUp
              ? "Time's Up"
              : "Submit Answer"}
        </button>
      </div>

      {isTimeUp && (
        <p className="wrong-message">
          ⏰ Time is up!
        </p>
      )}
    </form>
  );
}

export default PuzzleCard;