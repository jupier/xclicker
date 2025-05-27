import React, { useState } from "react";

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
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonClick = (action: () => void, buttonType: string) => {
    action();
    setClickedButton(buttonType);
    setTimeout(() => setClickedButton(null), 300);
  };

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
            className={`click-button ${clickedButton === "get-log" ? "shake" : ""}`}
            onClick={() => handleButtonClick(onGetLog, "get-log")}
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
            className={`split-button ${clickedButton === "split-log" ? "shake" : ""}`}
            onClick={() => handleButtonClick(onSplitLog, "split-log")}
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
            className={`split-round-button ${clickedButton === "split-round" ? "shake" : ""}`}
            onClick={() => handleButtonClick(onSplitRound, "split-round")}
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
