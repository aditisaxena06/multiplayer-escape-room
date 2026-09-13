function PuzzleRenderer({ currentPuzzle }) {
  if (!currentPuzzle) {
    return null;
  }

  return (
    <div className="puzzle-content">
      <h1>{currentPuzzle.title}</h1>

      <p className="puzzle-description">
        {currentPuzzle.description}
      </p>

      {/* NUMBER PUZZLE */}
      {currentPuzzle.type === "number" && (
        <div className="number-pattern">
          <div className="pattern-label">NUMBER SEQUENCE</div>

          <div className="pattern-box">
            <span>2</span>
            <span>4</span>
            <span>8</span>
            <span>16</span>
            <span className="pattern-arrow">→</span>
            <span className="pattern-question">?</span>
          </div>

          <p className="pattern-hint">
            Find the next number in the sequence.
          </p>
        </div>
      )}

      {/* CHOICE / DOOR PUZZLE */}
      {currentPuzzle.type === "choice" && (
        <div className="choice-puzzle">
          <p className="choice-instruction">
            Choose the door that leads to the escape route.
          </p>

          <div className="door-options">
            <button
              type="button"
              className="door-option"
              onClick={() => {
                const event = new CustomEvent("select-puzzle-answer", {
                  detail: "A",
                });
                window.dispatchEvent(event);
              }}
            >
              <div className="door-symbol">🌙</div>
              <div className="door-label">DOOR A</div>
              <div className="door-description">Moon Symbol</div>
            </button>

            <button
              type="button"
              className="door-option"
              onClick={() => {
                const event = new CustomEvent("select-puzzle-answer", {
                  detail: "B",
                });
                window.dispatchEvent(event);
              }}
            >
              <div className="door-symbol">🔑</div>
              <div className="door-label">DOOR B</div>
              <div className="door-description">Golden Key Symbol</div>
            </button>

            <button
              type="button"
              className="door-option"
              onClick={() => {
                const event = new CustomEvent("select-puzzle-answer", {
                  detail: "C",
                });
                window.dispatchEvent(event);
              }}
            >
              <div className="door-symbol">💀</div>
              <div className="door-label">DOOR C</div>
              <div className="door-description">Skull Symbol</div>
            </button>
          </div>

          <p className="choice-hint">
            Enter <strong>A</strong>, <strong>B</strong>, or <strong>C</strong> as your answer.
          </p>
        </div>
      )}

      {/* TEXT PUZZLE */}
      {currentPuzzle.type === "text" && (
        <div className="puzzle-instruction">
          Enter the answer that solves this riddle.
        </div>
      )}

      {/* CODE PUZZLE */}
      {currentPuzzle.type === "code" && (
        <div className="puzzle-instruction">
          Enter the correct escape code.
        </div>
      )}

      {/* IMAGE PUZZLE */}
      {currentPuzzle.type === "image" && (
        <div className="puzzle-instruction">
          Examine the image carefully and determine the answer.
        </div>
      )}

      <div className="puzzle-points">
        ⭐ {currentPuzzle.points || 0} points
      </div>
    </div>
  );
}

export default PuzzleRenderer;