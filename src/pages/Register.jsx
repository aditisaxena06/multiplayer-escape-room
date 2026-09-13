import {
  useContext,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { GameContext } from "../context/GameContext";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const { login } = useContext(GameContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setIsLoading(true);

      const data = await registerUser({
        name: username.trim(),
        email: email.trim(),
        password,
      });

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.message ||
          "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">🗝️</div>

          <h1>Escape Together</h1>

          <p>
            Create your player profile and
            start escaping.
          </p>
        </div>

        <h2>Create Account</h2>

        <form
          onSubmit={handleRegister}
          className="auth-form"
        >
          <div className="input-group">
            <label htmlFor="register-username">
              Username
            </label>

            <input
              id="register-username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              minLength={6}
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
              ? "Creating account..."
              : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;