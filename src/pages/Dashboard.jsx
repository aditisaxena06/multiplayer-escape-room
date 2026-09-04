import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, room } = useContext(GameContext);

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

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

        <section className="stats-section">

          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div>
              <p>Games Played</p>
              <h2>12</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div>
              <p>Successful Escapes</p>
              <h2>8</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <p>Win Rate</p>
              <h2>67%</h2>
            </div>
          </div>

        </section>

        <section className="recent-section">

          <div className="section-heading">
            <div>
              <p className="section-label">YOUR ACTIVITY</p>
              <h2>Recent Room</h2>
            </div>

            <button
              className="text-btn"
              onClick={() => navigate("/join-room")}
            >
              Browse Rooms →
            </button>
          </div>

          <div className="room-preview-card">

            <div className="room-info">

              <div className="room-icon">
                🏚️
              </div>

              <div>
                <h3>
                  {room?.roomName || "The Haunted Mansion"}
                </h3>

                <p>
                  Room Code:{" "}
                  <span>
                    {room?.roomCode || "ESCAPE123"}
                  </span>
                </p>
              </div>

            </div>

            <div className="room-meta">

              <span className="player-count">
                👥 {room?.players?.length || 3}/
                {room?.maxPlayers || 4}
              </span>

              <button
                className="secondary-btn small-btn"
                onClick={() => navigate("/lobby")}
              >
                View Room →
              </button>

            </div>

          </div>

        </section>

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