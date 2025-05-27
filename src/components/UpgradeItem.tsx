import React, { useState } from "react";

interface UpgradeItemProps {
  title: string;
  description: string;
  stats: string[];
  cost: number;
  woodPieces: number;
  onUpgrade: () => void;
}

export const UpgradeItem: React.FC<UpgradeItemProps> = ({
  title,
  description,
  stats,
  cost,
  woodPieces,
  onUpgrade,
}) => {
  const [isUpgraded, setIsUpgraded] = useState(false);

  const handleUpgrade = () => {
    onUpgrade();
    setIsUpgraded(true);
    setTimeout(() => setIsUpgraded(false), 500);
  };

  return (
    <div className={`upgrade-item ${isUpgraded ? "upgraded" : ""}`}>
      <div className="upgrade-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="upgrade-stats">
          {stats.map((stat, index) => (
            <div key={index}>{stat}</div>
          ))}
          <div>Next Level Cost: {cost} wood</div>
        </div>
      </div>
      <button
        className="upgrade-button"
        onClick={handleUpgrade}
        disabled={woodPieces < cost}
      >
        Upgrade ({cost} wood)
      </button>
      {woodPieces < cost && (
        <div className="upgrade-requirement">
          Need {cost - woodPieces} more wood pieces
        </div>
      )}
    </div>
  );
};
