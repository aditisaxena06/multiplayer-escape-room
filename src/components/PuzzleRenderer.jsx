function PuzzleRenderer({ currentPuzzle }) {
  return (
    <>
      {currentPuzzle === 1 && (
        <>
          <h2>The Whispering Wall</h2>

          <p className="puzzle-description">
            On the wall, mysterious words appear:
          </p>

          <div className="puzzle-riddle">
            <span>“I follow you everywhere,</span>
            <span>but disappear in the dark.</span>
            <span>What am I?”</span>
          </div>
        </>
      )}

      {currentPuzzle === 2 && (
        <>
          <h2>The Mysterious Pattern</h2>

          <p className="puzzle-description">
            A strange sequence appears on the wall:
          </p>

          <div className="puzzle-riddle">
            <span>2 → 4 → 8 → 16 → ?</span>
            <span>What number comes next?</span>
          </div>
        </>
      )}

      {currentPuzzle === 3 && (
        <>
          <h2>The Three Doors</h2>

          <p className="puzzle-description">
            Only one door leads to freedom.
          </p>

          <div className="puzzle-riddle">
            <span>Door A: Safe</span>
            <span>Door B: Trapped</span>
            <span>Door C: Unknown</span>
            <span>Which door should you choose?</span>
          </div>
        </>
      )}

      {currentPuzzle === 4 && (
        <>
          <h2>The Hidden Word</h2>

          <p className="puzzle-description">
            Decode the mysterious clue.
          </p>

          <div className="puzzle-riddle">
            <span>What has keys but cannot open locks?</span>
          </div>
        </>
      )}

      {currentPuzzle === 5 && (
        <>
          <h2>The Final Lock</h2>

          <p className="puzzle-description">
            Solve the final mystery to escape.
          </p>

          <div className="puzzle-riddle">
            <span>I have hands but cannot clap.</span>
            <span>What am I?</span>
          </div>
        </>
      )}
    </>
  );
}

export default PuzzleRenderer;