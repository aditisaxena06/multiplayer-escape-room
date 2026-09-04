import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(GameContext);

  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">

      <button
        type="button"
        className="nav-logo"
        onClick={() => navigate("/dashboard")}
      >
        <span className="nav-logo-icon">🔐</span>
        <span>Escape Together</span>
      </button>

      <div className="nav-links">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </button>

      </div>

      <div className="nav-user">

        <div className="user-avatar">
          {user?.avatar || "🎮"}
        </div>

        <span>{user?.name || "Player One"}</span>

        <button
          type="button"
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;