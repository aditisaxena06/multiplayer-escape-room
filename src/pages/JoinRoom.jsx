import {
  useState,
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  GameContext,
} from "../context/GameContext";

import {
  getRoomByCode,
  joinRoom,
} from "../services/api";


function JoinRoom() {
  const navigate = useNavigate();

  const { setRoom, token } = useContext(GameContext);

  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setError("");

    if (!roomCode.trim()) {
      setError("Please enter a room code.");
      return;
    }

    const enteredCode = roomCode.trim().toUpperCase();

    if (!token) {
      setError("Your login session has expired. Please login again.");
      return;
    }

    try {
      setIsLoading(true);

      /*
       * First JOIN the room.
       *
       * A new player is not a member yet,
       * so we must not call the member-only
       * GET /rooms/:code endpoint before this.
       */
      await joinRoom(enteredCode, token);

      /*
       * Now the player is a member.
       *
       * We can safely fetch the complete room
       * and player information.
       */
      const updatedData = await getRoomByCode(enteredCode, token);

      setRoom({
        ...updatedData.room,
        roomCode: updatedData.room.code,
        roomName:
          updatedData.room.roomName ||
          updatedData.room.name ||
          "Escape Room",
      });

      navigate("/lobby");
    } catch (error) {
      console.error("Join room error:", error);
      setError(error.message || "Failed to join room.");
    } finally {
      setIsLoading(false);
    }
  };


  return (

    <div className="join-room-page">

      <Navbar />


      <main className="join-room-container">


        <div className="join-room-card">


          <div className="join-room-icon">

            🔑

          </div>


          <p className="section-label">

            JOIN AN EXISTING GAME

          </p>


          <h1>

            Join an Escape Room

          </h1>


          <p className="page-description">

            Enter the room code shared by
            your friend to join their escape room.

          </p>


          <form onSubmit={handleJoinRoom}>


            <div className="form-group">

              <label htmlFor="room-code">

                Room Code

              </label>


              <input
                id="room-code"
                type="text"
                placeholder="e.g. ESC123"
                value={roomCode}
                onChange={(e) => {

                  setRoomCode(
                    e.target.value.toUpperCase()
                  );

                  setError("");

                }}
                maxLength={6}
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

                <strong>
                  Ready to join?
                </strong>


                <p>

                  Ask the room host for
                  the room code and enter it above.

                </p>

              </div>

            </div>


            <div className="join-room-buttons">


              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
                disabled={isLoading}
              >

                ← Back

              </button>


              <button
                type="submit"
                className="primary-btn"
                disabled={isLoading}
              >

                {isLoading
                  ? "Joining Room..."
                  : "Join Room →"}

              </button>


            </div>


          </form>


        </div>

      </main>

    </div>

  );

}


export default JoinRoom;