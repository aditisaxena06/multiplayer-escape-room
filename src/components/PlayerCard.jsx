function PlayerCard({ player, isHost = false, isDisconnected = false }) {
  return (
    <div
      className={`game-player-card ${
        isDisconnected ? "disconnected-player" : ""
      }`}
    >
      <div className="game-player-avatar">
        {player.avatar}
      </div>

      <div>
        <h3>
          {player.name}

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