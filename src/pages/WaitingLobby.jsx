import {
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import { GameContext } from "../context/GameContext";

import {
  getRoomByCode,
  getRoomPlayers,
  setRoomReady,
  startGameSession,
  leaveRoom,
} from "../services/api";


function WaitingLobby() {
  const navigate = useNavigate();

  const {
    room,
    setRoom,
    user,
    token,
    startGame,
  } = useContext(GameContext);

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  /*
   * Load room + players
   */
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (!room?.roomCode) {
      navigate("/dashboard");
      return;
    }

    let isMounted = true;

    const loadRoom = async () => {
      try {
        const [roomData, playersData] = await Promise.all([
          getRoomByCode(room.roomCode, token),
          getRoomPlayers(room.roomCode, token),
        ]);

        if (!isMounted) return;

        const backendRoom = roomData.room;
        const backendPlayers = playersData.players || [];

        /*
         * If game already started,
         * move directly to game screen.
         */
        if (backendRoom.status === "active") {
          startGame();
          navigate("/escape-room");
          return;
        }

        /*
         * Find backend host
         */
        const hostId =
          backendRoom.host?._id?.toString() ||
          backendRoom.host?.toString();

        /*
         * Format players for frontend
         */
        const formattedPlayers =
          backendPlayers.map((player) => ({
            id: player._id,
            userId: player.user?._id?.toString(),
            name: player.user?.name || "Player",
            avatar: player.user?.avatar || "🎮",
            ready: Boolean(player.isReady),
            isHost:
              hostId ===
              player.user?._id?.toString(),
          }));

        setPlayers(formattedPlayers);

        /*
         * Update room in GameContext
         */
        setRoom({
          ...room,
          ...backendRoom,
          roomCode: backendRoom.code,
          roomName:
            backendRoom.name ||
            backendRoom.roomName ||
            room.roomName ||
            "The Haunted Mansion",
        });

        setError("");
      } catch (error) {
        console.error(
          "Failed to load room:",
          error
        );

        if (isMounted) {
          setError(
            error.message ||
              "Failed to load room."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRoom();

    /*
     * Poll room state every 2 seconds.
     * This keeps players and ready status
     * synchronized until Socket.IO is added.
     */
    const interval = setInterval(
      loadRoom,
      2000
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [
    room?.roomCode,
    token,
    navigate,
    setRoom,
    startGame,
  ]);

  /*
   * Current logged-in player's lobby record
   */
  const currentPlayer = players.find(
    (player) =>
      player.userId?.toString() ===
      user?._id?.toString()
  );

  /*
   * Is current user the host?
   */
  const isHost =
    currentPlayer?.isHost === true;

  /*
   * Ready players count
   */
  const readyPlayers =
    players.filter(
      (player) => player.ready
    ).length;

  /*
   * All players must be ready
   */
  const allPlayersReady =
    players.length > 0 &&
    players.every(
      (player) => player.ready
    );

  /*
   * READY button
   */
  const handleReady = async () => {
    if (!currentPlayer) {
      setError(
        "Your player information could not be found."
      );
      return;
    }

    try {
      setError("");
      setIsActionLoading(true);

      await setRoomReady(
        room.roomCode,
        !currentPlayer.ready,
        token
      );

      /*
       * Immediately refresh room state
       */
      const [roomData, playersData] = await Promise.all([
        getRoomByCode(room.roomCode, token),
        getRoomPlayers(room.roomCode, token),
      ]);

      const backendRoom = roomData.room;
      const backendPlayers = playersData.players || [];

      const hostId =
        backendRoom.host?._id?.toString() ||
        backendRoom.host?.toString();

      const formattedPlayers =
        backendPlayers.map((player) => ({
          id: player._id,
          userId:
            player.user?._id?.toString(),
          name:
            player.user?.name || "Player",
          avatar:
            player.user?.avatar || "🎮",
          ready:
            Boolean(player.isReady),
          isHost:
            hostId ===
            player.user?._id?.toString(),
        }));

      setPlayers(formattedPlayers);

      setRoom({
        ...room,
        ...backendRoom,
        roomCode: backendRoom.code,
        roomName:
          room.roomName ||
          "The Haunted Mansion",
      });
    } catch (error) {
      console.error(
        "Ready status error:",
        error
      );

      setError(
        error.message ||
          "Failed to update ready status."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
   * Host starts game
   */
  const handleStartGame = async () => {
    if (!isHost) {
      setError(
        "Only the host can start the game."
      );
      return;
    }

    if (!allPlayersReady) {
      setError(
        "All players must be ready before starting the game."
      );
      return;
    }

    if (!room?._id) {
      setError(
        "Room information is missing."
      );
      return;
    }

    try {
      setError("");
      setIsActionLoading(true);

      /*
       * Backend is responsible for:
       * - checking host
       * - checking ready players
       * - changing WAITING/READY → ACTIVE
       * - creating GameSession
       * - unlocking Puzzle 1
       */
      await startGameSession(
        room._id,
        token
      );

      startGame();
      navigate("/escape-room");
    } catch (error) {
      console.error(
        "Failed to start game:",
        error
      );

      setError(
        error.message ||
          "Failed to start the game."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
   * Leave room
   */
  const handleLeaveRoom = async () => {
    try {
      setError("");
      setIsActionLoading(true);

      await leaveRoom(
        room.roomCode,
        token
      );

      setRoom(null);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Failed to leave room:",
        error
      );

      setError(
        error.message ||
          "Failed to leave the room."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  /*
   * Loading screen
   */
  if (isLoading) {
    return (
      <div className="lobby-page">
        <Navbar />

        <main className="lobby-container">
          <div className="loading-state">
            Loading room...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="lobby-page">
      <Navbar />

      <main className="lobby-container">

        {/* HEADER */}
        <section className="lobby-header">
          <p className="section-label">
            WAITING FOR PLAYERS
          </p>

          <h1>
            {room?.roomName ||
              "The Haunted Mansion"}
          </h1>

          <p className="lobby-description">
            Invite your friends and get ready
            to escape together.
          </p>
        </section>

        {/* ERROR */}
        {error && (
          <p className="form-error">
            ⚠️ {error}
          </p>
        )}

        {/* ROOM STATUS */}
        <section className="room-status">

          <div className="status-item">
            <span className="status-label">
              ROOM STATUS
            </span>

            <div className="status-value">
              <span className="status-dot"></span>

              {room?.status === "ready"
                ? "Ready to start"
                : room?.status === "active"
                  ? "Game in progress"
                  : "Waiting for players"}
            </div>
          </div>

          <div className="status-item">
            <span className="status-label">
              PLAYERS READY
            </span>

            <div className="status-value">
              {readyPlayers} / {players.length}
            </div>
          </div>

        </section>

        {/* ROOM CODE */}
        <section className="room-code-card">
          <p>ROOM CODE</p>

          <h2>
            {room?.roomCode ||
              room?.code ||
              "------"}
          </h2>

          <span>
            Share this code with your friends
            so they can join.
          </span>
        </section>

        {/* PLAYERS */}
        <section className="players-section">

          <div className="players-heading">

            <div>
              <p className="section-label">
                YOUR TEAM
              </p>

              <h2>Players</h2>
            </div>

            <div className="player-count">
              {players.length} /{" "}
              {room?.maxPlayers || 4}
            </div>

          </div>

          <div className="players-grid">

            {players.map((player) => (
              <div
                className="player-card"
                key={player.id}
              >

                <div className="player-avatar">
                  {player.avatar}
                </div>

                <div className="player-info">

                  <div className="player-name-row">

                    <h3>
                      {player.name}
                    </h3>

                    {player.isHost && (
                      <span className="host-badge">
                        👑 HOST
                      </span>
                    )}

                  </div>

                  <div className="player-status">

                    <span
                      className={
                        player.ready
                          ? "ready-dot"
                          : "not-ready-dot"
                      }
                    ></span>

                    {player.ready
                      ? "Ready"
                      : "Not Ready"}

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ACTIONS */}
        <section className="lobby-actions">

          <button
            className="secondary-btn leave-btn"
            onClick={handleLeaveRoom}
            disabled={isActionLoading}
          >
            ← Leave Room
          </button>

          <div className="lobby-main-actions">

            {/* READY BUTTON */}
            <button
              className="secondary-btn"
              onClick={handleReady}
              disabled={
                isActionLoading ||
                !currentPlayer
              }
            >
              {currentPlayer?.ready
                ? "✓ Ready"
                : "Ready Up"}
            </button>

            {/* START GAME BUTTON - HOST ONLY */}
            {isHost && (
              <button
                className={`primary-btn start-game-btn ${
                  !allPlayersReady
                    ? "disabled-start"
                    : ""
                }`}
                onClick={handleStartGame}
                disabled={
                  !allPlayersReady ||
                  isActionLoading
                }
              >
                {isActionLoading
                  ? "Starting..."
                  : allPlayersReady
                    ? "Start Game →"
                    : "Waiting for players..."}
              </button>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default WaitingLobby;