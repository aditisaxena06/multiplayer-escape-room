import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GameContext } from "../context/GameContext";
import { getGameHistory } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    room,
    token: contextToken,
  } = useContext(GameContext);

  const token =
    contextToken ||
    localStorage.getItem("token");

  const [gameHistory, setGameHistory] = useState([]);
  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  // =========================================
  // LOAD GAME HISTORY
  // =========================================

  useEffect(() => {
    if (!token) {
      setDashboardLoading(false);
      return;
    }

    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        const data = await getGameHistory(token);

        if (!cancelled) {
          setGameHistory(data.history || []);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard history:",
          error
        );

        if (!cancelled) {
          setGameHistory([]);
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // =========================================
  // ACTIVE ROOM
  // =========================================

  const hasRoom = Boolean(
    room?.roomCode ||
    room?.code ||
    room?._id
  );

  const activeRoomName =
    room?.roomName ||
    room?.name ||
    "Escape Room";

  const activeRoomCode =
    room?.roomCode ||
    room?.code ||
    "";

  const playerCount =
    room?.players?.length || 0;

  const maxPlayers =
    room?.maxPlayers || 4;

  // =========================================
  // RECENT GAME
  // =========================================

  const recentGame =
    gameHistory.length > 0
      ? gameHistory[0]
      : null;

  const recentRoom =
    recentGame?.room || null;

  const recentRoomName =
    recentRoom?.name ||
    recentRoom?.roomName ||
    "Recent Escape";

  const recentRoomCode =
    recentRoom?.code || "";

  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  const gamesPlayed =
    gameHistory.length;

  const successfulEscapes =
    gameHistory.filter(
      (game) =>
        game.status === "completed"
    ).length;

  const winRate =
    gamesPlayed > 0
      ? Math.round(
          (successfulEscapes /
            gamesPlayed) *
            100
        )
      : 0;

  // =========================================
  // RENDER
  // =========================================

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
            Gather your team, solve mysterious
            puzzles, and escape before time
            runs out.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn hero-btn"
              onClick={() =>
                navigate("/create-room")
              }
            >
              + Create Room
            </button>

            <button
              className="secondary-btn hero-btn"
              onClick={() =>
                navigate("/join-room")
              }
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
            PLAYER STATISTICS
        ========================= */}

        <section className="stats-section">

          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>
              <p>Games Played</p>

              <h2>
                {dashboardLoading
                  ? "—"
                  : gamesPlayed}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🏆
            </div>

            <div>
              <p>Successful Escapes</p>

              <h2>
                {dashboardLoading
                  ? "—"
                  : successfulEscapes}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⚡
            </div>

            <div>
              <p>Win Rate</p>

              <h2>
                {dashboardLoading
                  ? "—"
                  : `${winRate}%`}
              </h2>
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
              onClick={() =>
                navigate("/join-room")
              }
            >
              Join Another →
            </button>

          </div>


          {/* =========================
              ACTIVE ROOM
          ========================= */}

          {hasRoom ? (

            <div className="room-preview-card">

              <div className="room-info">

                <div className="room-icon">
                  🏚️
                </div>

                <div>

                  <h3>
                    {activeRoomName}
                  </h3>

                  <p>
                    Room Code:{" "}
                    <span>
                      {activeRoomCode}
                    </span>
                  </p>

                </div>

              </div>


              <div className="room-meta">

                <span className="player-count">
                  👥 {playerCount}/
                  {maxPlayers}
                </span>

                <button
                  className="secondary-btn small-btn"
                  onClick={() =>
                    navigate("/lobby")
                  }
                >
                  View Room →
                </button>

              </div>

            </div>

          ) : recentGame ? (

            /* =========================
               RECENT COMPLETED GAME
            ========================= */

            <div className="room-preview-card">

              <div className="room-info">

                <div className="room-icon">
                  🏆
                </div>

                <div>

                  <h3>
                    {recentRoomName}
                  </h3>

                  <p>
                    Room Code:{" "}
                    <span>
                      {recentRoomCode ||
                        "—"}
                    </span>
                  </p>

                </div>

              </div>


              <div className="room-meta">

                <span className="player-count">
                  ⭐{" "}
                  {recentGame.totalScore ||
                    0}{" "}
                  points
                </span>

                <button
                  className="secondary-btn small-btn"
                  onClick={() =>
                    navigate("/history")
                  }
                >
                  View History →
                </button>

              </div>

            </div>

          ) : (

            /* =========================
               NO ROOM / NO HISTORY
            ========================= */

            <div className="room-preview-card empty-room-card">

              <div className="room-info">

                <div className="room-icon">
                  🔐
                </div>

                <div>

                  <h3>
                    No Recent Room
                  </h3>

                  <p>
                    Create a room or join
                    your friends to begin
                    an escape.
                  </p>

                </div>

              </div>


              <div className="room-meta">

                <button
                  className="secondary-btn small-btn"
                  onClick={() =>
                    navigate("/create-room")
                  }
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
            . Your next escape adventure
            is waiting.
          </p>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;