import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function JoinRoom() {
  const navigate = useNavigate();
  const { room, setRoom, user } = useContext(GameContext);

  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = (e) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");

    // Empty room code
    if (!roomCode.trim()) {
      setError("Please enter a room code.");
      return;
    }

    const enteredCode = roomCode.trim().toUpperCase();

    // No active room exists
    if (!room) {
      setError(
        "No active room found. Please create a room first or check the room code."
      );
      return;
    }

    // Invalid room code
    if (room.roomCode !== enteredCode) {
      setError("Room not found. Please check the room code.");
      return;
    }

    // Room is full
    const maxPlayers = room.maxPlayers || 4;
    const currentPlayers = room.players || [];

    if (currentPlayers.length >= maxPlayers) {
      setError(
        `This room is full. Maximum ${maxPlayers} players are allowed.`
      );
      return;
    }

    // Prevent the same player from joining twice
    const alreadyJoined = currentPlayers.some(
      (player) => player.name === (user?.name || "Player One")
    );

    if (alreadyJoined) {
      navigate("/lobby");
      return;
    }

    // Mock loading state
    setIsLoading(true);

    setTimeout(() => {
      const updatedRoom = {
        ...room,
        players: [
          ...currentPlayers,
          {
            name: user?.name || "Player One",
            avatar: user?.avatar || "🎮",
            ready: false,
          },
        ],
      };

      setRoom(updatedRoom);
      setIsLoading(false);
      navigate("/lobby");
    }, 700);
  };

  return (
    <div className="join-room-page">
      <Navbar />

      <main className="join-room-container">
        <div className="join-room-card">

          <div className="join-room-icon">🔑</div>

          <p className="section-label">
            JOIN AN EXISTING GAME
          </p>

          <h1>Join an Escape Room</h1>

          <p className="page-description">
            Enter the room code shared by your friend to join their escape room.
          </p>

          <form onSubmit={handleJoinRoom}>

            <div className="form-group">
              <label>Room Code</label>

              <input
                type="text"
                placeholder="e.g. ESC123"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError("");
                }}
                maxLength="6"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="room-error">
                ⚠️ {error}
              </p>
            )}

            <div className="room-info-box">
              <span>👥</span>

              <div>
                <strong>Ready to join?</strong>

                <p>
                  Ask the room host for the room code and enter it above.
                </p>
              </div>
            </div>

            <div className="join-room-buttons">

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
                disabled={isLoading}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={isLoading}
              >
                {isLoading ? "Joining Room..." : "Join Room →"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default JoinRoom;