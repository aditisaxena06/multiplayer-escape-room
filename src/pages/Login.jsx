import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(GameContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter your username and password.");
      return;
    }

    setUser({
      name: username,
      avatar: "🎮",
    });

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">🔐</div>
          <h1>Escape Together</h1>
          <p>Work together. Solve puzzles. Escape.</p>
        </div>

        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn">
            Enter Game →
          </button>
        </form>

        <p className="auth-switch">
          New player? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;