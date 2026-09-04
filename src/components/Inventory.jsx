function Inventory() {
  const items = [
    { id: 1, icon: "🔑", name: "Old Key" },
    { id: 2, icon: "📜", name: "Old Note" },
    { id: 3, icon: "?", name: "" },
    { id: 4, icon: "?", name: "" },
  ];

  return (
    <div className="inventory-section">
      <div className="inventory-heading">
        <span>🎒</span>
        <h3>Inventory</h3>
      </div>

      <div className="inventory-items">
        {items.map((item) => (
          <div
            key={item.id}
            className={`inventory-item ${
              !item.name ? "empty-item" : ""
            }`}
          >
            {item.icon}

            {item.name && <span>{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;