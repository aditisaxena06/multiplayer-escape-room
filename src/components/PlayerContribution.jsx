function PlayerContribution({ playerName, avatar, points, maxPoints }) {
  const percentage =
    maxPoints > 0 ? Math.min((points / maxPoints) * 100, 100) : 0;

  return (
    <div className="contribution-item">
      <div className="contribution-player">
        <div className="contribution-avatar">
          {avatar}
        </div>

        <div className="contribution-info">
          <strong>{playerName}</strong>

          <div className="contribution-bar">
            <div
              className="contribution-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <strong className="contribution-score">
          +{points}
        </strong>
      </div>
    </div>
  );
}

export default PlayerContribution;