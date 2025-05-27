import React, { useState } from "react";

interface AdminPanelProps {
  onAddResources: (logs: number, rounds: number, woodPieces: number) => void;
  onSetWorkerStats: (health: number, level: number, regenRate: number) => void;
  onSetUpgradeLevels: (parallel: number, cooldown: number) => void;
  onToggleInstantCooldown: () => void;
  isInstantCooldown: boolean;
}

const buttonStyle = {
  flex: 1,
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "4px",
  cursor: "pointer",
  background: "#4a5568",
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onAddResources,
  onSetWorkerStats,
  onSetUpgradeLevels,
  onToggleInstantCooldown,
  isInstantCooldown,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-panel">
      <button
        className="admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 1000,
          background: "#ff4444",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "Close Admin" : "Open Admin"}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "60px",
            right: "10px",
            background: "#1a202c",
            padding: "20px",
            borderRadius: "8px",
            color: "#e2e8f0",
            width: "300px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#ffffff",
              fontSize: "1.2em",
            }}
          >
            Admin Panel
          </h3>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#ffffff" }}>
              Add Resources
            </h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onAddResources(100, 0, 0)}
                style={{ ...buttonStyle, background: "#4299e1" }}
              >
                +100 Logs
              </button>
              <button
                onClick={() => onAddResources(0, 100, 0)}
                style={{ ...buttonStyle, background: "#48bb78" }}
              >
                +100 Rounds
              </button>
              <button
                onClick={() => onAddResources(0, 0, 1000)}
                style={{ ...buttonStyle, background: "#ed8936" }}
              >
                +1000 Wood
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#ffffff" }}>
              Worker Stats
            </h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onSetWorkerStats(100, 10, 5)}
                style={{ ...buttonStyle, background: "#667eea" }}
              >
                Boost Worker
              </button>
              <button
                onClick={() => onSetWorkerStats(100, 1, 1)}
                style={{ ...buttonStyle, background: "#fc8181" }}
              >
                Reset Worker
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#ffffff" }}>
              Upgrade Levels
            </h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onSetUpgradeLevels(5, 5)}
                style={{ ...buttonStyle, background: "#9f7aea" }}
              >
                Boost Upgrades
              </button>
              <button
                onClick={() => onSetUpgradeLevels(1, 1)}
                style={{ ...buttonStyle, background: "#fc8181" }}
              >
                Reset Upgrades
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0", color: "#ffffff" }}>Cooldown</h4>
            <button
              onClick={onToggleInstantCooldown}
              style={{
                ...buttonStyle,
                width: "100%",
                background: isInstantCooldown ? "#fc8181" : "#68d391",
              }}
            >
              {isInstantCooldown ? "Disable" : "Enable"} Instant Cooldown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
