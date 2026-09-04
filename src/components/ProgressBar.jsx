function ProgressBar({ current, total }) {
  const progress = ((current - 1) / total) * 100;

  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;