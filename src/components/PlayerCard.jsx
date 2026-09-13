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

      <div>
        <h3>
          {player.name}

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
        </h3>

        <p>
          <span
            className={`ready-dot ${
              isDisconnected ? "disconnected-dot" : ""
            }`}
          ></span>

          {isDisconnected ? "Disconnected" : "Exploring"}
        </p>
      </div>
    </div>
  );
}

export default PlayerCard;