import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import PlayerCard from "../components/PlayerCard";
import Timer from "../components/Timer";
import ProgressBar from "../components/ProgressBar";
import HintPanel from "../components/HintPanel";
import PuzzleCard from "../components/PuzzleCard";
import PuzzleRenderer from "../components/PuzzleRenderer";
import Inventory from "../components/Inventory";
import Chat from "../components/Chat";

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
  const totalPuzzles = 5;

  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      player: "Alex",
      avatar: "🧑‍🚀",
      message: "Good luck everyone! Let's escape!",
      timestamp: "3:42 PM",
    },
    {
      id: 2,
      player: "Rahul",
      avatar: "🕵️",
      message: "I think I found something!",
      timestamp: "3:43 PM",
    },
    {
      id: 3,
      player: "Priya",
      avatar: "🧩",
      message: "Check the painting!",
      timestamp: "3:44 PM",
    },
  ]);

  const [activities] = useState([
    {
      id: 1,
      icon: "🧩",
      text: "Rahul solved Puzzle 2",
      time: "3:43 PM",
    },
    {
      id: 2,
      icon: "💡",
      text: "Alex used a hint",
      time: "3:44 PM",
    },
    {
      id: 3,
      icon: "👋",
      text: "Priya joined the room",
      time: "3:45 PM",
    },
  ]);

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
    {
      name: "Alex",
      avatar: "🧑‍🚀",
    },
    {
      name: "Rahul",
      avatar: "🕵️",
    },
    {
      name: "Priya",
      avatar: "🧩",
    },
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

    const correctAnswers = {
      1: "shadow",
      2: "32",
      3: "door a",
      4: "piano",
      5: "clock",
    };

    const correctAnswer = correctAnswers[currentPuzzle];

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

      <header className="game-header">

        <div className="game-title">

          <div className="game-icon">
            🏚️
          </div>

          <div>
            <p>ESCAPE ROOM</p>

            <h2>
              {room?.roomName || "The Haunted Mansion"}
            </h2>
          </div>

        </div>

        <div className="game-top-info">

          <Timer timeLeft={timeLeft} />

          <div className="progress-box">
            <span>PUZZLES</span>

            <strong>
              {currentPuzzle} / {totalPuzzles}
            </strong>
          </div>

        </div>

      </header>


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

          <section className="environment-panel">

            <div className="panel-heading">

              <div>

                <p className="section-label">
                  EXPLORE THE ROOM
                </p>

                <h2>The Forgotten Study</h2>

              </div>

              <span className="room-live">
                ● LIVE
              </span>

            </div>


            {/* ROOM */}

            <div className="room-environment">

              <div className="moon">
                🌙
              </div>

            <div className="wall-picture">
              🖼️
            </div>

            <div className="mystery-door">
              🚪
            </div>

            <div className="candle candle-one">
              🕯️
            </div>

            <div className="candle candle-two">
              🕯️
            </div>

            <div className="locked-chest">
              🔐
            </div>

            <p className="environment-text">
              A dark study filled with strange objects.
              Something seems hidden in the shadows...
            </p>
          </div>

          {/* INVENTORY */}
          <Inventory />
        </section>

        {/* RIGHT SIDE - PUZZLE */}
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

              {/* CLUE SECTION */}
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

              {/* ANSWER SECTION */}
              <PuzzleCard
                answer={answer}
                setAnswer={(value) => {
                  setAnswer(value);

                  if (!puzzleSolved && timeLeft > 0) {
                    setMessage("");
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
      </div>

                      {/* NEXT PUZZLE */}

                      {puzzleSolved && timeLeft > 0 && (
                        <div className="next-puzzle-section">
                          <button
                            className="next-puzzle-btn"
                            onClick={handleNextPuzzle}
                          >
                            {currentPuzzle === totalPuzzles
                              ? "🏆 Finish Game"
                              : "Next Puzzle →"}
                          </button>
                        </div>
                      )}

                      {/* CHAT & ACTIVITY */}

                      <section className="interaction-section">

                        {/* TEAM CHAT */}

                        <Chat
                          messages={chatMessages}
                          message={chatMessage}
                          setMessage={setChatMessage}
                          onSend={handleSendMessage}
                          onlineCount={players.length}
                          currentPlayer={user?.name || "Player One"}
                        />

                        {/* PLAYER ACTIVITY */}

                        <div className="activity-panel">

                          <div className="interaction-heading">
                            <div>
                              <p className="section-label">
                                ROOM UPDATES
                              </p>

                              <h2>
                                ⚡ Player Activity
                              </h2>
                            </div>
                          </div>

                          <div className="activity-list">

                            {activities.map((activity) => (
                              <div
                                className="activity-item"
                                key={activity.id}
                              >

                                <div className="activity-icon">
                                  {activity.icon}
                                </div>

                                <div className="activity-content">
                                  <p>
                                    {activity.text}
                                  </p>

                                  <span>
                                    {activity.time}
                                  </span>
                                </div>

                              </div>
                            ))}

                          </div>

                        </div>

                      </section>

        {/* PLAYERS */}

        <section className="game-players">

          {playerDisconnected && (
            <div className="disconnect-warning">
              ⚠️ Rahul has disconnected from the game.
            </div>
          )}

          <div className="game-players-heading">

            <div>

              <p className="section-label">
                YOUR TEAM
              </p>

              <h2>
                Players in Room
              </h2>

            </div>


            <span className="online-count">
              ● {playerDisconnected ? players.length - 1 : players.length} ONLINE
            </span>
            <button
              type="button"
              className="disconnect-demo-btn"
              onClick={() => setPlayerDisconnected((prev) => !prev)}
            >
              {playerDisconnected
                ? "Reconnect Rahul"
                : "Simulate Disconnect"}
            </button>

          </div>


          <div className="game-players-grid">

            {players.map((player, index) => (
              <PlayerCard
                key={player.name}
                player={player}
                isHost={index === 0}
                isDisconnected={
                  player.name === "Rahul" && playerDisconnected
                }
              />
            ))}

          </div>

        </section>


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