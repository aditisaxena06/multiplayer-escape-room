function GameInteractions({
  chatMessages = [],
  chatMessage = "",
  setChatMessage = () => {},
  handleSendMessage = () => {},
  players = [],
  user = null,
  activities = [],
}) {
  return (
    <section className="interaction-section">

      {/* TEAM CHAT */}
      <div className="chat-panel">
        <div className="interaction-heading">
          <div>
            <p className="section-label">
              TEAM COMMUNICATION
            </p>
            <h2>💬 Team Chat</h2>
          </div>

          <span className="online-count">
            ● {players.length} ONLINE
          </span>
        </div>

        <div className="chat-messages">
          {chatMessages.map((chat) => (
            <div
              className={`chat-message ${
                chat.player === (user?.name || "Player One")
                  ? "my-message"
                  : ""
              }`}
              key={chat.id}
            >
              <div className="chat-avatar">
                {chat.avatar}
              </div>

              <div className="chat-content">
                <div className="chat-message-header">
                  <strong>{chat.player}</strong>
                  <span>{chat.timestamp}</span>
                </div>

                <p>{chat.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="chat-input-area"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={(e) =>
              setChatMessage(e.target.value)
            }
          />

          <button
            type="submit"
            className="chat-send-btn"
          >
            Send →
          </button>
        </form>
      </div>

      {/* ACTIVITY */}
      <div className="activity-panel">
        <div className="interaction-heading">
          <div>
            <p className="section-label">
              LIVE UPDATES
            </p>
            <h2>⚡ Activity</h2>
          </div>
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div
              className="activity-item"
              key={activity.id}
            >
              <div className="activity-icon">
                {activity.icon}
              </div>

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

export default GameInteractions;