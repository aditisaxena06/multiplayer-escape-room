import {
  useContext,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { GameContext } from "../context/GameContext";

import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(GameContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password,
      });


      const loginSuccess = login(data.user, data.token);

      if (loginSuccess) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.message || "Login failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">🔐</div>

          <h1>Escape Together</h1>

          <p>
            Work together. Solve puzzles. Escape.
          </p>
        </div>

        <h2>Welcome Back</h2>

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >
          <div className="input-group">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing in..."
              : "Enter Game →"}
          </button>
        </form>

        <p className="auth-switch">
          New player?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;