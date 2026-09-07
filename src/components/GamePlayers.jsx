import PlayerCard from "./PlayerCard";

function GamePlayers({
  players,
  playerDisconnected,
  setPlayerDisconnected,
}) {
  return (
    <section className="game-players">
      {playerDisconnected && (
        <div className="disconnect-warning">
          ⚠️ Rahul has disconnected from the game.
        </div>
      )}

      <div className="game-players-heading">
        <div>
          <p className="section-label">
            YOUR TEAM
          </p>

          <h2>
            Players in Room
          </h2>
        </div>

        <span className="online-count">
          ●{" "}
          {playerDisconnected
            ? players.length - 1
            : players.length}{" "}
          ONLINE
        </span>

        <button
          type="button"
          className="disconnect-demo-btn"
          onClick={() =>
            setPlayerDisconnected((prev) => !prev)
          }
        >
          {playerDisconnected
            ? "Reconnect Rahul"
            : "Simulate Disconnect"}
        </button>
      </div>

      <div className="game-players-grid">
        {players.map((player, index) => (
          <PlayerCard
            key={player.name}
            player={player}
            isHost={index === 0}
            isDisconnected={
              player.name === "Rahul" &&
              playerDisconnected
            }
          />
        ))}
      </div>
    </section>
  );
}

export default GamePlayers;