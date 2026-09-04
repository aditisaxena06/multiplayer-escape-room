import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  // -----------------------------
  // USER STATE
  // -----------------------------
  const [user, setUser] = useState(null);

  // -----------------------------
  // ROOM STATE
  // -----------------------------
  const [room, setRoom] = useState(null);

  // -----------------------------
  // GAME STATE
  // -----------------------------
  const [gameStatus, setGameStatus] = useState("waiting");
  // waiting | loading | playing | completed | failed

  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);

  const [hintsUsed, setHintsUsed] = useState(0);

  const [teamScore, setTeamScore] = useState(0);

  const [completionTime, setCompletionTime] = useState(0);

  // -----------------------------
  // PLAYER CONTRIBUTIONS
  // -----------------------------
  const [playerContributions, setPlayerContributions] = useState({});

  // -----------------------------
  // ERROR / UI STATE
  // -----------------------------
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);

  // -----------------------------
  // GAME HELPERS
  // -----------------------------

  const resetGame = () => {
    setGameStatus("waiting");
    setCurrentPuzzle(1);
    setPuzzlesSolved(0);
    setHintsUsed(0);
    setTeamScore(0);
    setCompletionTime(0);
    setPlayerContributions({});
    setError(null);
    setIsLoading(false);
    setIsPuzzleLoading(false);
  };

  const startGame = () => {
    setError(null);
    setGameStatus("playing");
  };

  const completeGame = (time = 0) => {
    setCompletionTime(time);
    setGameStatus("completed");
  };

  const failGame = () => {
    setGameStatus("failed");
  };

  const addHintUsed = () => {
    setHintsUsed((prev) => prev + 1);
  };

  const addPuzzleSolved = () => {
    setPuzzlesSolved((prev) => prev + 1);
  };

  const addScore = (points) => {
    setTeamScore((prev) => prev + points);
  };

  const addPlayerContribution = (playerName, points) => {
    setPlayerContributions((prev) => ({
      ...prev,
      [playerName]: (prev[playerName] || 0) + points,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        // User
        user,
        setUser,

        // Room
        room,
        setRoom,

        // Game state
        gameStatus,
        setGameStatus,

        currentPuzzle,
        setCurrentPuzzle,

        puzzlesSolved,
        setPuzzlesSolved,

        hintsUsed,
        setHintsUsed,

        teamScore,
        setTeamScore,

        completionTime,
        setCompletionTime,

        // Contributions
        playerContributions,
        setPlayerContributions,

        // Loading
        isLoading,
        setIsLoading,

        isPuzzleLoading,
        setIsPuzzleLoading,

        // Error
        error,
        setError,

        // Helpers
        resetGame,
        startGame,
        completeGame,
        failGame,
        addHintUsed,
        addPuzzleSolved,
        addScore,
        addPlayerContribution,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}