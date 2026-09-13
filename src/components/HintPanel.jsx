function HintPanel({
  hints = [],
  showHint,
  onToggle,
  disabled = false,
  isLoading = false,
}) {
  const firstHint = hints[0];

  return (
    <div className="clue-section">
      <div className="clue-heading">
        <span>💡</span>

        <div>
          <p>CLUE</p>

          <strong>
            {isLoading
              ? "Loading available hints..."
              : showHint && firstHint
                ? "Hint revealed."
                : "Need a little help? Use a hint."}
          </strong>
        </div>
      </div>

      {showHint && firstHint && (
        <div className="hint-message">
          💡 {firstHint.text}
        </div>
      )}

      <button
        type="button"
        className="hint-btn"
        onClick={onToggle}
        disabled={disabled || isLoading}
      >
        💡{" "}
        {isLoading
          ? "Loading Hint..."
          : showHint
            ? "Hide Hint"
            : "Get Hint"}
      </button>
    </div>
  );
}

export default HintPanel;