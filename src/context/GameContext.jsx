import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/api";

export const GameContext = createContext();

export function GameProvider({ children }) {
  // ==========================================
  // USER STATE
  // ==========================================

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // ==========================================
  // ROOM STATE
  // ==========================================

  const [room, setRoom] = useState(null);

  // ==========================================
  // GAME STATE
  // ==========================================

  const [gameStatus, setGameStatus] =
    useState("waiting");

  const [currentPuzzle, setCurrentPuzzle] =
    useState(1);

  const [puzzlesSolved, setPuzzlesSolved] =
    useState(0);

  const [hintsUsed, setHintsUsed] =
    useState(0);

  const [teamScore, setTeamScore] =
    useState(0);

  const [completionTime, setCompletionTime] =
    useState(0);

  // ==========================================
  // PLAYER CONTRIBUTIONS
  // ==========================================

  const [
    playerContributions,
    setPlayerContributions,
  ] = useState({});

  // ==========================================
  // ERROR / LOADING STATE
  // ==========================================

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isPuzzleLoading, setIsPuzzleLoading] =
    useState(false);

  // ==========================================
  // RESET GAME
  // ==========================================

  const resetGame = useCallback(() => {
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
  }, []);

  // ==========================================
  // RESTORE LOGIN
  // ==========================================

  useEffect(() => {
    const restoreUser = async () => {
      if (!token) {
        return;
      }

      try {
        const data =
          await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        console.error(
          "Failed to restore user:",
          error
        );

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    };

    restoreUser();
  }, [token]);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = useCallback(
    (userData, authToken) => {
      console.log(
        "1. LOGIN FUNCTION CALLED"
      );

      localStorage.setItem(
        "token",
        authToken
      );

      setToken(authToken);
      setUser(userData);
      setError(null);

      return true;
    },
    []
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = useCallback(() => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setRoom(null);

    resetGame();
  }, [resetGame]);

  // ==========================================
  // START GAME
  // ==========================================

  const startGame = useCallback(() => {
    setError(null);
    setGameStatus("playing");
  }, []);

  // ==========================================
  // COMPLETE GAME
  // ==========================================

  const completeGame = useCallback(
    (time = 0) => {
      setCompletionTime(time);
      setGameStatus("completed");
    },
    []
  );

  // ==========================================
  // FAIL GAME
  // ==========================================

  const failGame = useCallback(() => {
    setGameStatus("failed");
  }, []);

  // ==========================================
  // ADD HINT
  // ==========================================

  const addHintUsed = useCallback(() => {
    setHintsUsed(
      (previous) => previous + 1
    );
  }, []);

  // ==========================================
  // ADD PUZZLE SOLVED
  // ==========================================

  const addPuzzleSolved =
    useCallback(() => {
      setPuzzlesSolved(
        (previous) => previous + 1
      );
    }, []);

  // ==========================================
  // ADD SCORE
  // ==========================================

  const addScore = useCallback(
    (points) => {
      setTeamScore(
        (previous) =>
          previous + points
      );
    },
    []
  );

  // ==========================================
  // ADD PLAYER CONTRIBUTION
  // ==========================================

  const addPlayerContribution =
    useCallback(
      (playerName, points) => {
        setPlayerContributions(
          (previous) => ({
            ...previous,

            [playerName]:
              (previous[playerName] || 0) +
              points,
          })
        );
      },
      []
    );

  // ==========================================
  // CONTEXT PROVIDER
  // ==========================================

  return (
    <GameContext.Provider
      value={{
        // User
        user,
        setUser,
        token,
        login,
        logout,

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