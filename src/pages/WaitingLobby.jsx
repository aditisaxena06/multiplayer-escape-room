import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function WaitingLobby() {
  const navigate = useNavigate();
  const { room, user } = useContext(GameContext);

  // Mock players for Week 1
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: user?.name || "Player One",
      avatar: user?.avatar || "🎮",
      ready: true,
      isHost: true,
    },
    {
      id: 2,
      name: "Alex",
      avatar: "🧑‍🚀",
      ready: true,
      isHost: false,
    },
    {
      id: 3,
      name: "Rahul",
      avatar: "🕵️",
      ready: true,
      isHost: false,
    },
    {
      id: 4,
      name: "Priya",
      avatar: "🧩",
      ready: false,
      isHost: false,
    },
  ]);

  const toggleReady = (id) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === id
          ? {
              ...player,
              ready: !player.ready,
            }
          : player
      )
    );
  };

  const allPlayersReady = players.every(
    (player) => player.ready
  );

  const readyPlayers = players.filter(
    (player) => player.ready
  ).length;

  const handleStartGame = () => {
    if (!allPlayersReady) {
      alert("All players must be ready before starting!");
      return;
    }

    navigate("/escape-room");
  };

  const handleLeaveRoom = () => {
    navigate("/dashboard");
  };

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
            {room?.roomName || "Escape Room"}
          </h1>

          <p className="lobby-description">
            Invite your friends and get ready to escape together.
          </p>

        </section>


        {/* ROOM STATUS */}

        <section className="room-status">

          <div className="status-item">

            <span className="status-label">
              ROOM STATUS
            </span>

            <div className="status-value">
              <span className="status-dot"></span>
              Waiting for players
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
            {room?.roomCode || "ESC123"}
          </h2>

          <span>
            Share this code with your friends so they can join.
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
              {players.length} / {room?.maxPlayers || 4}
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


                {/* MOCK STATUS BUTTON */}

                {!player.isHost && (

                  <button
                    className="status-toggle"
                    onClick={() =>
                      toggleReady(player.id)
                    }
                  >

                    Toggle

                  </button>

                )}

              </div>

            ))}

          </div>

        </section>


        {/* ACTIONS */}

        <section className="lobby-actions">

          <button
            className="secondary-btn leave-btn"
            onClick={handleLeaveRoom}
          >
            ← Leave Room
          </button>


          <button
            className={`primary-btn start-game-btn ${
              !allPlayersReady
                ? "disabled-start"
                : ""
            }`}
            onClick={handleStartGame}
          >

            {allPlayersReady
              ? "Start Game →"
              : "Waiting for players..."}

          </button>

        </section>

      </main>
    </div>
  );
}

export default WaitingLobby;