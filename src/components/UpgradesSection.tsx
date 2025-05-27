import React from "react";
import { UpgradeItem } from "./UpgradeItem";

interface UpgradesSectionProps {
  woodPieces: number;
  workerLevel: number;
  regenerationRate: number;
  parallelProcessingLevel: number;
  cooldownReductionLevel: number;
  getWorkerTrainingCost: () => number;
  getParallelProcessingCost: () => number;
  getCooldownReductionCost: () => number;
  getActualCooldown: () => number;
  onUpgradeWorker: () => void;
  onUpgradeParallelProcessing: () => void;
  onUpgradeCooldownReduction: () => void;
}

export const UpgradesSection: React.FC<UpgradesSectionProps> = ({
  woodPieces,
  workerLevel,
  regenerationRate,
  parallelProcessingLevel,
  cooldownReductionLevel,
  getWorkerTrainingCost,
  getParallelProcessingCost,
  getCooldownReductionCost,
  getActualCooldown,
  onUpgradeWorker,
  onUpgradeParallelProcessing,
  onUpgradeCooldownReduction,
}) => {
  return (
    <section className="upgrades-section">
      <h2>Upgrades</h2>
      <div className="upgrades-list">
        <UpgradeItem
          title="Worker Training"
          description="Improves health regeneration rate"
          stats={[
            `Current Level: ${workerLevel}`,
            `Regeneration: +${regenerationRate}/s`,
          ]}
          cost={getWorkerTrainingCost()}
          woodPieces={woodPieces}
          onUpgrade={onUpgradeWorker}
        />

        <UpgradeItem
          title="Parallel Processing"
          description="Allows cutting multiple logs at once"
          stats={[
            `Current Level: ${parallelProcessingLevel}`,
            `Logs per cut: ${parallelProcessingLevel}`,
            `Health cost: ${20 * parallelProcessingLevel}%`,
          ]}
          cost={getParallelProcessingCost()}
          woodPieces={woodPieces}
          onUpgrade={onUpgradeParallelProcessing}
        />

        <UpgradeItem
          title="Efficiency Training"
          description="Reduces cooldown between log cuts"
          stats={[
            `Current Level: ${cooldownReductionLevel}`,
            `Cooldown: ${getActualCooldown()}s`,
            `Next Level: ${Math.max(5, getActualCooldown() - 5)}s`,
          ]}
          cost={getCooldownReductionCost()}
          woodPieces={woodPieces}
          onUpgrade={onUpgradeCooldownReduction}
        />
      </div>
    </section>
  );
};
