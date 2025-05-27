import React from "react";
import { ResourceItem } from "./ResourceItem";

interface HeaderProps {
  logs: number;
  rounds: number;
  woodPieces: number;
  workerHealth: number;
  regenerationDelay: number;
  isRegenerating: boolean;
  workerLevel: number;
}

export const Header: React.FC<HeaderProps> = ({
  logs,
  rounds,
  woodPieces,
  workerHealth,
  regenerationDelay,
  isRegenerating,
  workerLevel,
}) => {
  return (
    <header className="game-header">
      <h1>Wood Clicker Game</h1>
      <div className="header-content">
        <div className="resources-display">
          <ResourceItem icon="🪵" count={logs} label="Logs" />
          <ResourceItem icon="⭕" count={rounds} label="Rounds" />
          <ResourceItem icon="🪚" count={woodPieces} label="Wood Pieces" />
        </div>

        <div className="worker-status-header">
          <div className="health-bar">
            <div
              className="health-fill"
              style={{ width: `${workerHealth}%` }}
            />
          </div>
          <div className="health-text">
            Health: {workerHealth}%
            {regenerationDelay > 0 &&
              ` (Regenerating in ${regenerationDelay}s)`}
            {isRegenerating && workerHealth < 100 && " (Regenerating...)"}
          </div>
          <div className="worker-level">Level: {workerLevel}</div>
        </div>
      </div>
    </header>
  );
};
