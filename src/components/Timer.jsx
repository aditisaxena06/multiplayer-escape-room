function Timer({ timeLeft = 0 }) {
  const safeTime = Number.isFinite(Number(timeLeft))
    ? Math.max(0, Number(timeLeft))
    : 0;

  const minutes = Math.floor(safeTime / 60);
  const seconds = safeTime % 60;

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