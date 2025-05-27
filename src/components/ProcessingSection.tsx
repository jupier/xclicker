import React from "react";

interface ProcessingSectionProps {
  cooldown: number;
  currentLog: number;
  currentRound: number;
  logs: number;
  rounds: number;
  workerHealth: number;
  parallelProcessingLevel: number;
  onGetLog: () => void;
  onSplitLog: () => void;
  onSplitRound: () => void;
  getLogDisabledReason: () => string;
  getLogSplittingDisabledReason: () => string;
  getRoundSplittingDisabledReason: () => string;
  getLogSplittingButtonText: () => string;
  getRoundSplittingButtonText: () => string;
}

export const ProcessingSection: React.FC<ProcessingSectionProps> = ({
  cooldown,
  currentLog,
  currentRound,
  logs,
  rounds,
  workerHealth,
  parallelProcessingLevel,
  onGetLog,
  onSplitLog,
  onSplitRound,
  getLogDisabledReason,
  getLogSplittingDisabledReason,
  getRoundSplittingDisabledReason,
  getLogSplittingButtonText,
  getRoundSplittingButtonText,
}) => {
  return (
    <section className="processing-section">
      <div className="processing-header">
        <h2>Wood Processing</h2>
        {cooldown > 0 && (
          <div className="cooldown-timer">
            Next log available in: {cooldown}s
          </div>
        )}
      </div>

      <div className="action-buttons">
        <div className="button-container">
          <button
            className="click-button"
            onClick={onGetLog}
            disabled={
              cooldown > 0 || workerHealth < 20 * parallelProcessingLevel
            }
          >
            Get {parallelProcessingLevel} Log
            {parallelProcessingLevel > 1 ? "s" : ""}{" "}
            {cooldown > 0 ? `(${cooldown}s)` : ""}
          </button>
          <div className="tooltip">{getLogDisabledReason()}</div>
        </div>

        <div className="button-container">
          <button
            className="split-button"
            onClick={onSplitLog}
            disabled={
              (currentLog === 0 && logs === 0) ||
              (currentLog === 0 && workerHealth < 10) ||
              (currentLog > 0 && workerHealth < 2)
            }
          >
            {getLogSplittingButtonText()}
          </button>
          <div className="tooltip">{getLogSplittingDisabledReason()}</div>
        </div>

        <div className="button-container">
          <button
            className="split-round-button"
            onClick={onSplitRound}
            disabled={
              (currentRound === 0 && rounds === 0) ||
              (currentRound === 0 && workerHealth < 5) ||
              (currentRound > 0 && workerHealth < 1)
            }
          >
            {getRoundSplittingButtonText()}
          </button>
          <div className="tooltip">{getRoundSplittingDisabledReason()}</div>
        </div>
      </div>
    </section>
  );
};
