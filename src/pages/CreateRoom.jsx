import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";
import { createRoom } from "../services/api";

function CreateRoom() {
  const navigate = useNavigate();
  const { user, token, setRoom } = useContext(GameContext);

  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      alert("Please enter a room name!");
      return;
    }

    try {
      setIsLoading(true);

      const data = await createRoom(
        {
          name: roomName.trim(),
          maxPlayers: Number(maxPlayers),
        },
        token
      );

      console.log("CREATE ROOM RESPONSE:", data);

      if (!data?.room) {
        throw new Error("Room was not returned by the server");
      }

      const newRoom = {
        ...data.room,
        roomName: roomName.trim(),
        roomCode: data.room.code,
        maxPlayers: Number(data.room.maxPlayers || maxPlayers),
        players: [
          {
            name: user?.name || "Player One",
            avatar: user?.avatar || "🎮",
          },
        ],
      };

      console.log("NEW ROOM:", newRoom);

      setRoom(newRoom);

      navigate("/lobby", {
        state: {
          room: newRoom,
        },
      });
    } catch (error) {
      alert(error.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
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
                minLength={2}
                maxLength={50}
                required
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
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Room →"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default CreateRoom;