import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function CreateRoom() {
  const navigate = useNavigate();
  const { user, setRoom } = useContext(GameContext);

  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);

  const handleCreateRoom = (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      alert("Please enter a room name!");
      return;
    }

    const roomCode =
      "ESC" + Math.floor(100 + Math.random() * 900);

    const newRoom = {
      roomName: roomName.trim(),
      roomCode: roomCode,
      maxPlayers: Number(maxPlayers),
      players: [
        {
          name: user?.name || "Player One",
          avatar: user?.avatar || "🎮",
        },
      ],
    };

    setRoom(newRoom);

    navigate("/lobby", {
        state: {
            room: newRoom,
        },
    });
  };

  return (
    <div className="create-room-page">
      <Navbar />

      <main className="create-room-container">
        <div className="create-room-card">

          <div className="page-icon">🏚️</div>

          <p className="section-label">
            CREATE A NEW GAME
          </p>

          <h1>Create Your Escape Room</h1>

          <p className="page-description">
            Set up a room and invite your friends to solve puzzles together.
          </p>

          <form onSubmit={handleCreateRoom}>

            <div className="form-group">
              <label>Room Name</label>

              <input
                type="text"
                placeholder="e.g. The Haunted Mansion"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Maximum Players</label>

              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              >
                <option value="2">2 Players</option>
                <option value="3">3 Players</option>
                <option value="4">4 Players</option>
                <option value="5">5 Players</option>
                <option value="6">6 Players</option>
              </select>
            </div>

            <div className="room-info-box">
              <span>🎮</span>

              <div>
                <strong>You will be the room host</strong>
                <p>
                  Share the room code with your friends after creating the room.
                </p>
              </div>
            </div>

            <div className="create-room-buttons">

              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
              >
                ← Back
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                Create Room →
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default CreateRoom;