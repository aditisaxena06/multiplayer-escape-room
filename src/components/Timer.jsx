function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="timer-box">
      <span>⏱</span>
      <strong>{formattedTime}</strong>
    </div>
  );
}

export default Timer;