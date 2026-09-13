import PuzzleRenderer from "./PuzzleRenderer";
import HintPanel from "./HintPanel";
import PuzzleCard from "./PuzzleCard";

function PuzzleSection({
  currentPuzzle,
  totalPuzzles,
  hints,
  showHint,
  onHint,
  isHintLoading,
  answer,
  setAnswer,
  onSubmit,
  isSubmitting,
  timeLeft,
}) {
  if (!currentPuzzle) {
    return (
      <aside className="puzzle-panel">
        <div className="puzzle-loading">
          <div className="puzzle-loading-icon">
            🧩
          </div>

          <h2>Loading Puzzle...</h2>

          <p>
            Preparing the next clue for your team.
          </p>

          <div className="loading-spinner"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="puzzle-panel">
      <div className="puzzle-number">
        PUZZLE {currentPuzzle.order} OF{" "}
        {totalPuzzles}
      </div>

      <PuzzleRenderer
        currentPuzzle={currentPuzzle}
      />

      <HintPanel
        hints={hints}
        showHint={showHint}
        onToggle={onHint}
        disabled={false}
        isLoading={isHintLoading}
      />

      <PuzzleCard
        answer={answer}
        setAnswer={setAnswer}
        message=""
        puzzleSolved={false}
        timeLeft={timeLeft}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </aside>
  );
}

export default PuzzleSection;