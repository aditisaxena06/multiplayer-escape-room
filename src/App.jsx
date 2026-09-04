import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import WaitingLobby from "./pages/WaitingLobby";
import EscapeRoom from "./pages/EscapeRoom";
import GameResult from "./pages/GameResult";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/join-room" element={<JoinRoom />} />
      <Route path="/lobby" element={<WaitingLobby />} />
      <Route path="/escape-room" element={<EscapeRoom />} />
      <Route path="/result" element={<GameResult />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}

export default App;