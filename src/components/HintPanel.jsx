function HintPanel({
  currentPuzzle,
  showHint,
  onToggle,
  disabled = false,
}) {
  return (
    <div className="clue-section">
      <div className="clue-heading">
        <span>💡</span>

        <div>
          <p>CLUE</p>

          <strong>
            {currentPuzzle === 1 && "Look at what light creates."}
            {currentPuzzle === 2 &&
              "Think about how the numbers are changing."}
            {currentPuzzle === 3 &&
              "Choose the door that is clearly safe."}
            {currentPuzzle === 4 &&
              "Think of something with many keys."}
            {currentPuzzle === 5 &&
              "Think about something that has hands and tells time."}
          </strong>
        </div>
      </div>

      {showHint && (
        <div className="hint-message">
          {currentPuzzle === 1 &&
            "👀 You can see it when there is light, but not when everything is dark."}

          {currentPuzzle === 2 &&
            "🔢 Each number is being multiplied by 2. Continue the pattern."}

          {currentPuzzle === 3 &&
            "🚪 Read the descriptions carefully. One door is explicitly marked safe."}

          {currentPuzzle === 4 &&
            "🎹 Think of something that has many keys but isn't used to open doors."}

          {currentPuzzle === 5 &&
            "🕐 It has hands, but those hands cannot clap."}
        </div>
      )}

      <button
        type="button"
        className="hint-btn"
        onClick={onToggle}
        disabled={disabled}
      >
        💡 {showHint ? "Hide Hint" : "Get Hint"}
      </button>
    </div>
  );
}

export default HintPanel;