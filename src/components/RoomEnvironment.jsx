import Inventory from "./Inventory";

function RoomEnvironment() {
  return (
    <section className="environment-panel">
      <div className="panel-heading">
        <div>
          <p className="section-label">
            EXPLORE THE ROOM
          </p>

          <h2>The Forgotten Study</h2>
        </div>

        <span className="room-live">
          ● LIVE
        </span>
      </div>

      <div className="room-environment">
        <div className="moon">
          🌙
        </div>

        <div className="wall-picture">
          🖼️
        </div>

        <div className="mystery-door">
          🚪
        </div>

        <div className="candle candle-one">
          🕯️
        </div>

        <div className="candle candle-two">
          🕯️
        </div>

        <div className="locked-chest">
          🔐
        </div>

        <p className="environment-text">
          A dark study filled with strange objects.
          Something seems hidden in the shadows...
        </p>
      </div>

      <Inventory />
    </section>
  );
}

export default RoomEnvironment;