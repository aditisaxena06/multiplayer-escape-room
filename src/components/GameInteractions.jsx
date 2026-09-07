import Chat from "./Chat";

function GameInteractions({
  chatMessages,
  chatMessage,
  setChatMessage,
  handleSendMessage,
  players,
  user,
  activities,
}) {
  return (
    <section className="interaction-section">

      {/* TEAM CHAT */}

      <Chat
        messages={chatMessages}
        message={chatMessage}
        setMessage={setChatMessage}
        onSend={handleSendMessage}
        onlineCount={players.length}
        currentPlayer={user?.name || "Player One"}
      />

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