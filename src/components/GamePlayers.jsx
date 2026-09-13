import PlayerCard from "./PlayerCard";

function GamePlayers({ players = [], currentUserId }) {
  return (
    <section className="game-players">
      <div className="game-players-heading">
        <div>
          <p className="section-label">YOUR TEAM</p>
          <h2>Players in Room</h2>
        </div>

        <span className="online-count">
          ● {players.filter((player) => player.isConnected !== false).length} ONLINE
        </span>
      </div>

      <div className="game-players-grid">
        {players.length === 0 ? (
          <p>No players in this room.</p>
        ) : (
          players.map((player) => (
            <PlayerCard
              key={player.id || player.userId}
              player={player}
              isHost={player.isHost}
              isCurrentUser={player.userId === currentUserId}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default GamePlayers;