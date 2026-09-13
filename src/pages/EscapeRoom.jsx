import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import GameHeader from "../components/GameHeader";
import PuzzleSection from "../components/PuzzleSection";
import GamePlayers from "../components/GamePlayers";
import GameInteractions from "../components/GameInteractions";
import NextPuzzle from "../components/NextPuzzle";
import RoomEnvironment from "../components/RoomEnvironment";
import { io } from "socket.io-client";

import { GameContext } from "../context/GameContext";
import {
  INITIAL_CHAT_MESSAGES,
  INITIAL_ACTIVITIES,
} from "../data/gameData";

import {
  getGameSession,
  submitPuzzleAnswer,
  getPuzzleHints,
  getRoomPlayers,
  usePuzzleHint,
} from "../services/api";

const TOTAL_PUZZLES = 5;
const SOCKET_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function EscapeRoom() {
  const navigate = useNavigate();

  const {
    user,
    room,
    token,
    startGame,
    addPuzzleSolved,
    addHintUsed,
    addScore,
    addPlayerContribution,
    completeGame,
    failGame,
    setCompletionTime,
  } = useContext(GameContext);

  const [gameSession, setGameSession] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);

  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const [players, setPlayers] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);

  const [error, setError] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const socketRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([]);

  const [activities, setActivities] = useState([]);

  /*
   * ==========================================
   * SOCKET.IO CHAT
   * ==========================================
   */

  useEffect(() => {
    if (!token || !room?.roomCode) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "🔌 Socket connected:",
        socket.id
      );

      socket.emit(
        "room:join",
        room.roomCode
      );
    });

    socket.on("connect_error", (err) => {
      console.error(
        "❌ Socket connection error:",
        err.message
      );
    });

    socket.on("chat:history", (messages) => {
      console.log(
        "💬 CHAT HISTORY:",
        messages
      );

      const formattedMessages =
        messages.map((message) => ({
          id: message.id,
          player: message.name,
          avatar: message.avatar || "🎮",
          message: message.text,
          timestamp: new Date(
            message.timestamp
          ).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        }));

      setChatMessages(formattedMessages);
    });

    socket.on("chat:message", (message) => {
      console.log(
        "💬 NEW CHAT MESSAGE:",
        message
      );

      const formattedMessage = {
        id: message.id,
        player: message.name,
        avatar: message.avatar || "🎮",
        message: message.text,
        timestamp: new Date(
          message.timestamp
        ).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      setChatMessages((previous) => [
        ...previous,
        formattedMessage,
      ]);
    });

    socket.on("player:online", (player) => {
      setActivities((previous) => [
        ...previous,
        {
          id: `online-${Date.now()}-${player.userId}`,
          icon: "👋",
          text: `${player.name} joined the room`,
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    });

    socket.on("player:offline", ({ userId }) => {
      setActivities((previous) => {
        const player = players.find(
          (p) => p.userId === userId
        );

        return [
          ...previous,
          {
            id: `offline-${Date.now()}-${userId}`,
            icon: "👋",
            text: `${player?.name || "A player"} left the room`,
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
          },
        ];
      });
    });

    socket.on("game:activity", (activity) => {
      console.log("🎮 GAME ACTIVITY:", activity);

      setActivities((previous) => [
        ...previous,
        {
          id: `activity-${Date.now()}-${Math.random()}`,
          icon: activity.icon || "🎮",
          text: activity.text,
          time: new Date(activity.timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    });

    socket.on("player:joined", (data) => {
      console.log("🟢 SOCKET player:joined", data);
    });

    socket.on("player:ready", (data) => {
      console.log("🟢 SOCKET player:ready", data);
    });

    socket.on("game:started", (data) => {
      console.log("🟢 SOCKET game:started", data);
    });

    socket.on("puzzle:completed", (data) => {
      console.log("🟢 SOCKET puzzle:completed", data);
    });

    socket.on("score:updated", (data) => {
      console.log("🟢 SOCKET score:updated", data);
    });

    socket.on("player:disconnected", (data) => {
      console.log("🔴 SOCKET player:disconnected", data);
    });

    socket.on("player:reconnected", (data) => {
      console.log("🟢 SOCKET player:reconnected", data);
    });

    socket.on("game:completed", (data) => {
      console.log("🏆 SOCKET game:completed", data);
    });

    socket.on("room:error", (data) => {
      console.error(
        "❌ Room socket error:",
        data?.message
      );
    });

    return () => {
      socket.off("chat:history");
      socket.off("chat:message");

      socket.off("player:online");
      socket.off("player:offline");

      socket.off("player:joined");
      socket.off("player:ready");
      socket.off("player:reconnected");
      socket.off("player:disconnected");

      socket.off("game:started");
      socket.off("game:activity");
      socket.off("puzzle:completed");
      socket.off("score:updated");
      socket.off("game:completed");

      socket.off("room:error");
      socket.off("connect");
      socket.off("connect_error");

      socket.disconnect();

      socketRef.current = null;
    };
  }, [token, room?.roomCode]);

  /*
   * ==========================================
   * LOAD GAME SESSION
   * ==========================================
   */

  useEffect(() => {
    if (!room?._id || !token) {
      return;
    }

    let cancelled = false;

    const loadGame = async () => {
      try {
        setError("");

        console.log("========== TIMER DEBUG ==========");
        console.log("ROOM OBJECT:", room);
        console.log("ROOM ID:", room?._id);
        console.log("ROOM CODE:", room?.roomCode);
        console.log("TOKEN EXISTS:", Boolean(token));
        console.log("=================================");

        const data = await getGameSession(
          room._id,
          token
        );

        if (cancelled) {
          return;
        }

        const session = data.session;

        console.log(
          "🎮 GAME SESSION SYNC:",
          session?.status,
          "backendRemaining:",
          data.remainingSeconds,
          "room:",
          room?._id
        );

        if (!session) {
          setError("Game session not found.");
          return;
        }

        setGameSession(session);

        console.log("GAME SESSION RECEIVED:", session);
        console.log(
          "CURRENT PUZZLE RECEIVED:",
          session.currentPuzzle
        );

        setCurrentPuzzle(session.currentPuzzle);

        /*
         * If backend says game is active,
         * update frontend game state.
         */

        if (session.status === "active") {
          startGame();
        }

        /*
         * If game already finished,
         * go directly to result page.
         */

        if (
          session.status === "completed" ||
          session.status === "failed"
        ) {
          navigate("/result");
          return;
        }

        /*
         * Calculate timer from backend.
         */

        if (
          session.startedAt &&
          session.durationSeconds
        ) {
          const startedAt = new Date(
            session.startedAt
          ).getTime();

          const elapsed = Math.floor(
            (Date.now() - startedAt) / 1000
          );

          const remaining = Math.max(
            0,
            session.durationSeconds - elapsed
          );

          setTimeLeft(remaining);
        }
      } catch (err) {
        console.error(
          "Load game error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Failed to load game."
          );
        }
      }
    };

    loadGame();

    return () => {
      cancelled = true;
    };
  }, [
    room?._id,
    token,
    navigate,
    startGame,
  ]);

  /*
   * ==========================================
   * SYNC GAME SESSION
   * ==========================================
   *
   * Both players poll the backend.
   * MongoDB remains the source of truth.
   */

  useEffect(() => {
    if (!room?._id || !token) {
      return;
    }

    const syncGame = async () => {
      try {
        const data = await getGameSession(
          room._id,
          token
        );

        const session = data.session;

        if (!session) {
          return;
        }

        setGameSession(session);

        setCurrentPuzzle(
          session.currentPuzzle || null
        );

        /*
         * Synchronize timer with backend.
         */

        if (
          session.startedAt &&
          session.durationSeconds
        ) {
          const startedAt = new Date(
            session.startedAt
          ).getTime();

          const elapsed = Math.floor(
            (Date.now() - startedAt) / 1000
          );

          setTimeLeft(
            Math.max(
              0,
              session.durationSeconds -
                elapsed
            )
          );
        }

        /*
         * Backend is authoritative.
         */

        if (
          session.status === "completed" ||
          session.status === "failed"
        ) {
          if (
            session.endedAt &&
            session.startedAt
          ) {
            const duration = Math.floor(
              (
                new Date(
                  session.endedAt
                ).getTime() -
                new Date(
                  session.startedAt
                ).getTime()
              ) / 1000
            );

            setCompletionTime(
              Math.min(
                duration,
                session.durationSeconds
              )
            );
          }

          if (
            session.status === "completed"
          ) {
            completeGame();
          } else {
            failGame();
          }

          navigate("/result");
        }
      } catch (err) {
        console.error(
          "Game sync error:",
          err
        );
      }
    };

    syncGame();

    const interval = setInterval(
      syncGame,
      2000
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    room?._id,
    token,
    navigate,
    completeGame,
    failGame,
    setCompletionTime,
  ]);

  /*
   * ==========================================
   * LOCAL TIMER DISPLAY
   * ==========================================
   */

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        Math.max(0, previous - 1)
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  /*
   * ==========================================
   * LOAD PUZZLE HINTS
   * ==========================================
   */

  useEffect(() => {
    if (
      !currentPuzzle?._id ||
      !token
    ) {
      setHints([]);
      setShowHint(false);
      return;
    }

    let cancelled = false;

    const loadHints = async () => {
      try {
        setIsHintLoading(true);

        const data =
          await getPuzzleHints(
            currentPuzzle._id,
            token
          );

        console.log("🔎 HINT API RESPONSE:", data);

        if (!cancelled) {
          setHints(data.hints || []);
        }
      } catch (err) {
        console.error(
          "Hint loading error:",
          err
        );

        if (!cancelled) {
          setHints([]);
        }
      } finally {
        if (!cancelled) {
          setIsHintLoading(false);
        }
      }
    };

    loadHints();

    setShowHint(false);

    return () => {
      cancelled = true;
    };
  }, [
    currentPuzzle?._id,
    token,
  ]);

  /*
   * ==========================================
   * LOAD ROOM PLAYERS
   * ==========================================
   */

  useEffect(() => {
    if (
      !room?.roomCode ||
      !token
    ) {
      return;
    }

    let cancelled = false;

    const loadPlayers = async () => {
      try {
        const data =
          await getRoomPlayers(
            room.roomCode,
            token
          );

        if (cancelled) {
          return;
        }

        const backendPlayers =
          data.players || [];

        const formattedPlayers =
          backendPlayers.map(
            (player) => ({
              id: player._id,
              userId:
                player.user?._id,
              name:
                player.user?.name ||
                "Player",
              avatar:
                player.user?.avatar ||
                "🎮",
              ready: Boolean(player.isReady),
              isHost:
                room.host?._id ===
                  player.user?._id ||
                room.host?.toString() ===
                  player.user?._id,
            })
          );

        setPlayers(
          formattedPlayers
        );
      } catch (err) {
        console.error(
          "Player loading error:",
          err
        );
      }
    };

    loadPlayers();

    const interval = setInterval(
      loadPlayers,
      2000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [
    room?.roomCode,
    token,
    room?.host,
  ]);

  /*
   * ==========================================
   * SHOW / HIDE HINT
   * ==========================================
   */

  const handleSendMessage = (event) => {
    event.preventDefault();

    const text = chatMessage.trim();

    if (!text) {
      return;
    }

    if (!socketRef.current) {
      console.error(
        "❌ Socket is not connected"
      );
      return;
    }

    if (!socketRef.current.connected) {
      console.error(
        "❌ Socket is disconnected"
      );
      return;
    }

    socketRef.current.emit(
      "chat:send",
      text
    );

    setChatMessage("");
  };

  const handleHint = async () => {
    const actualRoomId =
      room?._id ||
      room?.roomId ||
      room?.id;

    console.log("💡 HINT CLICKED");
    console.log("Puzzle ID:", currentPuzzle?._id);
    console.log("Room ID:", actualRoomId);
    console.log("Token:", token ? "present" : "missing");
    console.log("Time Left:", timeLeft);

    if (
      isHintLoading ||
      timeLeft <= 0 ||
      !currentPuzzle?._id ||
      !actualRoomId ||
      !token
    ) {
      console.log("❌ Hint request blocked");
      return;
    }

    if (showHint) {
      setShowHint(false);
      return;
    }

    try {
      setIsHintLoading(true);

      const data = await usePuzzleHint(
        currentPuzzle._id,
        actualRoomId,
        token
      );

      console.log("💡 HINT USED:", data);

      if (data.hint) {
        setHints([data.hint]);
        setShowHint(true);
      }

      addHintUsed();
    } catch (err) {
      console.error("❌ Hint usage error:", err);
      setError(err.message || "Unable to use hint");
    } finally {
      setIsHintLoading(false);
    }
  };

  /*
   * ==========================================
   * SUBMIT PUZZLE ANSWER
   * ==========================================
   */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !answer.trim() ||
      !currentPuzzle?._id ||
      !room?._id ||
      !token ||
      isSubmitting ||
      timeLeft <= 0
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const data =
        await submitPuzzleAnswer(
          currentPuzzle._id,
          room._id,
          answer.trim(),
          token
        );

      /*
       * Backend response format:
       *
       * {
       *   success: true,
       *   message: "...",
       *   result: {
       *      isCorrect,
       *      pointsEarned,
       *      gameCompleted,
       *      nextPuzzle
       *   }
       * }
       */

      const result = data.result;

      if (!result) {
        throw new Error(
          "Invalid response from server."
        );
      }

      /*
       * WRONG ANSWER
       */

      if (!result.isCorrect) {
        setError(
          data.message ||
            "Incorrect answer. Try again!"
        );

        return;
      }

      /*
       * CORRECT ANSWER
       */

      const pointsEarned =
        result.pointsEarned || 0;

      if (pointsEarned > 0) {
        addScore(pointsEarned);

        addPlayerContribution(
          user?.name ||
            "Player",
          pointsEarned
        );
      }

      addPuzzleSolved();

      setAnswer("");
      setError("");

      /*
       * ======================================
       * GAME COMPLETED
       * ======================================
       */

      if (result.gameCompleted) {
        completeGame();

        if (
          gameSession?.startedAt
        ) {
          const duration =
            Math.floor(
              (
                Date.now() -
                new Date(
                  gameSession.startedAt
                ).getTime()
              ) / 1000
            );

          setCompletionTime(
            Math.min(
              duration,
              gameSession.durationSeconds
            )
          );
        }

        navigate("/result");

        return;
      }

      /*
       * ======================================
       * MOVE TO NEXT PUZZLE
       * ======================================
       */

      if (result.nextPuzzle) {
        setCurrentPuzzle(
          result.nextPuzzle
        );

        setHints([]);
        setShowHint(false);
      }

      /*
       * Refresh session from backend.
       */

      const updatedSession =
        await getGameSession(
          room._id,
          token
        );

      if (updatedSession.session) {
        setGameSession(
          updatedSession.session
        );

        setCurrentPuzzle(
          updatedSession.session
            .currentPuzzle || null
        );
      }
    } catch (err) {
      console.error(
        "Submit answer error:",
        err
      );

      setError(
        err.message ||
          "Failed to submit answer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * ==========================================
   * FORMAT TIMER
   * ==========================================
   */

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = timeLeft % 60;

  const formattedTime =
    `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

  /*
   * ==========================================
   * LOADING SCREEN
   * ==========================================
   */

  if (!currentPuzzle) {
    return (
      <div className="escape-room-page">
        <Navbar />

        <main className="escape-room-container">
          <div className="loading-state">
            <h2>
              Loading game...
            </h2>

            {error && (
              <div className="game-error">
                ⚠️ {error}
              </div>
            )}

            <div className="loading-spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ==========================================
   * MAIN GAME UI
   * ==========================================
   */

  return (
    <div className="escape-room-page">
      <Navbar />

      <main className="escape-room-container">
        <GameHeader
          roomName={
            room?.roomName ||
            room?.name ||
            "The Haunted Mansion"
          }
          currentPuzzle={currentPuzzle.order}
          totalPuzzles={TOTAL_PUZZLES}
          timeLeft={timeLeft}
          teamScore={gameSession?.totalScore || 0}
        />

        {error && (
          <div className="game-error">
            ⚠️ {error}
          </div>
        )}

        <PuzzleSection
          currentPuzzle={
            currentPuzzle
          }
          totalPuzzles={
            TOTAL_PUZZLES
          }
          answer={answer}
          setAnswer={
            setAnswer
          }
          onSubmit={
            handleSubmit
          }
          isSubmitting={
            isSubmitting
          }
          hints={hints}
          showHint={
            showHint
          }
          onHint={
            handleHint
          }
          isHintLoading={
            isHintLoading
          }
          timeLeft={
            timeLeft
          }
        />

        <GamePlayers
          players={players}
          currentUserId={
            user?._id
          }
        />

        <GameInteractions
          chatMessages={chatMessages}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          handleSendMessage={handleSendMessage}
          players={players}
          user={user}
          activities={activities}
        />

        <NextPuzzle
          currentPuzzle={
            currentPuzzle.order
          }
          totalPuzzles={
            TOTAL_PUZZLES
          }
        />

      </main>
    </div>
  );
}

export default EscapeRoom;