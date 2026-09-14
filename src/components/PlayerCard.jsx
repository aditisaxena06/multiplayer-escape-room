function PlayerCard({
  player,
  isHost = false,
  isCurrentUser = false,
}) {
  const isDisconnected = player.isConnected === false;

  return (
    <div
      className={`game-player-card ${
        isDisconnected ? "disconnected-player" : ""
      }`}
    >
      <div className="game-player-avatar">
        {player.avatar || "🎮"}
      </div>

      <div className="game-player-info">
        <div className="game-player-name-row">
          <h3>{player.name}</h3>

          {isCurrentUser && (
            <span className="you-tag">
              YOU
            </span>
          )}

          {isHost && (
            <span className="host-tag">
              👑 HOST
            </span>
          )}
        </div>

        <p>
          <span
            className={`ready-dot ${
              isDisconnected ? "disconnected-dot" : ""
            }`}
          ></span>

          {isDisconnected
            ? "Disconnected"
            : "Exploring"}
        </p>
      </div>
    </div>
  );
}

export default PlayerCard;