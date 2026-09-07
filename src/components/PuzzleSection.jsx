import PuzzleRenderer from "./PuzzleRenderer";
import HintPanel from "./HintPanel";
import PuzzleCard from "./PuzzleCard";

function PuzzleSection({
  currentPuzzle,
  totalPuzzles,
  isPuzzleLoading,
  showHint,
  setShowHint,
  addHintUsed,
  puzzleSolved,
  timeLeft,
  answer,
  setAnswer,
  message,
  handleSubmit,
}) {
  return (
    <aside className="puzzle-panel">
      {isPuzzleLoading ? (
        <div className="puzzle-loading">
          <div className="puzzle-loading-icon">🧩</div>
          <h2>Loading Next Puzzle...</h2>
          <p>Preparing the next clue for your team.</p>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="puzzle-number">
            PUZZLE {currentPuzzle} OF {totalPuzzles}
          </div>

          <PuzzleRenderer currentPuzzle={currentPuzzle} />

          <HintPanel
            currentPuzzle={currentPuzzle}
            showHint={showHint}
            onToggle={() => {
              if (!showHint) {
                addHintUsed();
              }

              setShowHint((prev) => !prev);
            }}
            disabled={puzzleSolved || timeLeft <= 0}
          />

          <PuzzleCard
            answer={answer}
            setAnswer={(value) => {
              setAnswer(value);

              if (!puzzleSolved && timeLeft > 0) {
                // Message is cleared by the parent when needed.
              }
            }}
            message={message}
            puzzleSolved={puzzleSolved}
            timeLeft={timeLeft}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </aside>
  );
}

export default PuzzleSection;