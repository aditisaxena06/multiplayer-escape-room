import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import GamePlayers from "../components/GamePlayers";
import GameHeader from "../components/GameHeader";
import ProgressBar from "../components/ProgressBar";
import PuzzleSection from "../components/PuzzleSection";
import RoomEnvironment from "../components/RoomEnvironment";
import GameInteractions from "../components/GameInteractions";
import NextPuzzle from "../components/NextPuzzle";
import {
  TOTAL_PUZZLES,
  CORRECT_ANSWERS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ACTIVITIES,
} from "../data/gameData";
import { DEFAULT_PLAYERS } from "../data/players";

function EscapeRoom() {
  const navigate = useNavigate();
  const {
    user,
    room,
    addPuzzleSolved,
    addHintUsed,
    addScore,
    addPlayerContribution,
    completeGame,
    failGame,
    setCompletionTime,
  } = useContext(GameContext);

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const totalPuzzles = TOTAL_PUZZLES;

  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState(
    INITIAL_CHAT_MESSAGES
  );

  const [activities] = useState(INITIAL_ACTIVITIES);

  const [timeLeft, setTimeLeft] = useState(5 * 60); 
  const [isPuzzleLoading, setIsPuzzleLoading] = useState(false);
  const [playerDisconnected, setPlayerDisconnected] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setMessage("⏰ Time's up!");

      setCompletionTime(5 * 60);

      failGame();

      // Go to failure result screen
      setTimeout(() => {
        navigate("/result");
      }, 1000);

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, failGame, setCompletionTime, navigate]);


  // Mock players for now
  const players = [
    {
      name: user?.name || "Player One",
      avatar: user?.avatar || "🎮",
    },
    ...DEFAULT_PLAYERS,
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (puzzleSolved) {
      return;
    }

    if (timeLeft <= 0) {
      setMessage("⏰ Time's up! You can no longer submit an answer.");
      return;
    }

    if (!answer.trim()) {
      setMessage("⚠️ Enter an answer first!");
      return;
    }

    const correctAnswer = CORRECT_ANSWERS[currentPuzzle];

    if (answer.trim().toLowerCase() === correctAnswer) {
      setPuzzleSolved(true);

      // Phase 7: update centralized game state
      addPuzzleSolved();
      addScore(100);

      addPlayerContribution(
        user?.name || "Player One",
        100
      );

      if (currentPuzzle === totalPuzzles) {
        completeGame(5 * 60 - timeLeft);

        setMessage("🏆 Correct! You escaped the room!");
      } else {
        setMessage(
          "🎉 Correct! You unlocked the next clue."
        );
      }
    } else {
      setMessage("❌ Incorrect answer. Try again!");
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzle < totalPuzzles) {
      setIsPuzzleLoading(true);

      setTimeout(() => {
        setCurrentPuzzle((prev) => prev + 1);
        setPuzzleSolved(false);
        setAnswer("");
        setMessage("");
        setShowHint(false);
        setIsPuzzleLoading(false);
      }, 500);
    } else {
      navigate("/result");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) {
      return;
    }

    const now = new Date();

    const timestamp = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(),
      player: user?.name || "Player One",
      avatar: user?.avatar || "🎮",
      message: chatMessage.trim(),
      timestamp,
    };

    setChatMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);

    setChatMessage("");
  };

  return (
    <div className="escape-room-page">

      {/* GAME HEADER */}

      <GameHeader
        roomName={room?.roomName}
        timeLeft={timeLeft}
        currentPuzzle={currentPuzzle}
        totalPuzzles={totalPuzzles}
      />

      <main className="game-container">

        {/* GAME STATUS */}

        <div className="game-status-bar">

          <div>
            <span className="status-dot"></span>

            {timeLeft <= 0
              ? "Game Over"
              : puzzleSolved
              ? "Puzzle Solved"
              : "Game in Progress"}
          </div>

          <div className="progress-text">

            Escape Progress

            <ProgressBar
              current={currentPuzzle}
              total={totalPuzzles}
            />

          </div>

        </div>


        <div className="game-layout">
          {/* LEFT SIDE - ROOM ENVIRONMENT */}
          <RoomEnvironment />

          {/* RIGHT SIDE - PUZZLE */}
          <PuzzleSection
            currentPuzzle={currentPuzzle}
            totalPuzzles={totalPuzzles}
            isPuzzleLoading={isPuzzleLoading}
            showHint={showHint}
            setShowHint={setShowHint}
            addHintUsed={addHintUsed}
            puzzleSolved={puzzleSolved}
            timeLeft={timeLeft}
            answer={answer}
            setAnswer={setAnswer}
            message={message}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* NEXT PUZZLE */}
        <NextPuzzle
          currentPuzzle={currentPuzzle}
          totalPuzzles={totalPuzzles}
          puzzleSolved={puzzleSolved}
          handleNextPuzzle={handleNextPuzzle}
        />

      {/* CHAT & ACTIVITY */}

      <GameInteractions
        chatMessages={chatMessages}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        handleSendMessage={handleSendMessage}
        players={players}
        user={user}
        activities={activities}
      />

      {/* PLAYERS */}

      <GamePlayers
        players={players}
        playerDisconnected={playerDisconnected}
        setPlayerDisconnected={setPlayerDisconnected}
      />

      {/* GAME FOOTER */}

      <div className="game-footer">
        <button
          className="leave-game-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Leave Game
        </button>
      </div>

    </main>

  </div>
);
}

export default EscapeRoom;