function Chat({
  messages,
  message,
  setMessage,
  onSend,
  onlineCount,
  currentPlayer,
}) {
  return (
    <div className="chat-panel">
      <div className="interaction-heading">
        <div>
          <p className="section-label">TEAM COMMUNICATION</p>
          <h2>💬 Team Chat</h2>
        </div>

        <span className="online-count">
          ● {onlineCount} ONLINE
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((chat) => (
          <div
            className={`chat-message ${
              chat.player === currentPlayer ? "my-message" : ""
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
        onSubmit={onSend}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          aria-label="Type a chat message"
          autoComplete="off"
        />

        <button
          type="submit"
          aria-label="Send chat message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

export default Chat;