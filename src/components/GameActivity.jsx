function GameActivity({
  chatMessages,
  chatMessage,
  setChatMessage,
  handleSendMessage,
  activities,
  user,
}) {
  return (
    <section className="game-interactions">
      {/* CHAT */}
      <div className="chat-panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">TEAM COMMUNICATION</p>
            <h2>Team Chat</h2>
          </div>

          <span className="online-count">
            ● {chatMessages.length > 0 ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        <div className="chat-messages">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.player === user?.name ? "current-player" : ""
              }`}
            >
              <div className="chat-avatar">{msg.avatar}</div>

              <div className="chat-content">
                <div className="chat-meta">
                  <strong>{msg.player}</strong>
                  <span>{msg.timestamp}</span>
                </div>

                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..."
            aria-label="Type a team chat message"
          />

          <button type="submit" aria-label="Send message">
            ➤
          </button>
        </form>
      </div>

      {/* ACTIVITY */}
      <div className="activity-panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">LIVE UPDATES</p>
            <h2>Activity</h2>
          </div>
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <div className="activity-icon">{activity.icon}</div>

              <div className="activity-content">
                <p>{activity.text}</p>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GameActivity;