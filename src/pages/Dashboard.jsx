import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, room } = useContext(GameContext);

  const hasRoom = Boolean(room?.roomCode || room?.code);

  const roomName =
    room?.roomName ||
    room?.name ||
    "No active room";

  const roomCode =
    room?.roomCode ||
    room?.code ||
    "";

  const playerCount =
    room?.players?.length || 0;

  const maxPlayers =
    room?.maxPlayers || 4;

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* =========================
            HERO
        ========================= */}
        <section className="hero-section">

          <div className="hero-badge">
            MULTIPLAYER ESCAPE ROOM
          </div>

          <h1>
            Ready to <span>Escape?</span>
          </h1>

          <p>
            Gather your team, solve mysterious puzzles,
            and escape before time runs out.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn hero-btn"
              onClick={() => navigate("/create-room")}
            >
              + Create Room
            </button>

            <button
              className="secondary-btn hero-btn"
              onClick={() => navigate("/join-room")}
            >
              🔑 Join Room
            </button>

          </div>

        </section>


        {/* =========================
            QUICK STATS
        ========================= */}
        <section className="stats-section">

          <div className="stat-card">
            <div className="stat-icon">
              🎮
            </div>

            <div>
              <p>Game Mode</p>
              <h2>Multiplayer</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              🧩
            </div>

            <div>
              <p>Puzzles</p>
              <h2>5</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              ⏱️
            </div>

            <div>
              <p>Time Limit</p>
              <h2>5 Min</h2>
            </div>
          </div>

        </section>


        {/* =========================
            RECENT / ACTIVE ROOM
        ========================= */}
        <section className="recent-section">

          <div className="section-heading">

            <div>
              <p className="section-label">
                YOUR ACTIVITY
              </p>

              <h2>
                {hasRoom
                  ? "Active Room"
                  : "Recent Room"}
              </h2>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate("/join-room")}
            >
              Join Another →
            </button>

          </div>


          {hasRoom ? (
            <div className="room-preview-card">

              <div className="room-info">

                <div className="room-icon">
                  🏚️
                </div>

                <div>

                  <h3>
                    {roomName}
                  </h3>

                  <p>
                    Room Code:{" "}
                    <span>
                      {roomCode}
                    </span>
                  </p>

                </div>

              </div>


              <div className="room-meta">

                <span className="player-count">
                  👥 {playerCount}/{maxPlayers}
                </span>

                <button
                  className="secondary-btn small-btn"
                  onClick={() => navigate("/lobby")}
                >
                  View Room →
                </button>

              </div>

            </div>
          ) : (
            <div className="room-preview-card empty-room-card">

              <div className="room-info">

                <div className="room-icon">
                  🔐
                </div>

                <div>

                  <h3>
                    No Active Room
                  </h3>

                  <p>
                    Create a room or join your
                    friends to begin an escape.
                  </p>

                </div>

              </div>


              <div className="room-meta">

                <button
                  className="secondary-btn small-btn"
                  onClick={() => navigate("/create-room")}
                >
                  Create Room →
                </button>

              </div>

            </div>
          )}

        </section>


        {/* =========================
            WELCOME MESSAGE
        ========================= */}
        <section className="welcome-message">

          <span>👋</span>

          <p>
            Welcome back,{" "}
            <strong>
              {user?.name || "Player"}
            </strong>
            . Your next escape adventure is waiting.
          </p>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;