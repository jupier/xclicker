import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [logs, setLogs] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [woodPieces, setWoodPieces] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [workerHealth, setWorkerHealth] = useState(100);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationDelay, setRegenerationDelay] = useState(0);
  const [workerLevel, setWorkerLevel] = useState(1);
  const [regenerationRate, setRegenerationRate] = useState(1); // Health points per second
  const [parallelProcessingLevel, setParallelProcessingLevel] = useState(1);
  const [cooldownReductionLevel, setCooldownReductionLevel] = useState(1);
  const baseCooldown = 30; // Base cooldown in seconds

  // Health regeneration timer
  useEffect(() => {
    let timer: number;
    if (isRegenerating && workerHealth < 100) {
      timer = setInterval(() => {
        setWorkerHealth((prev) => Math.min(100, prev + regenerationRate));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRegenerating, workerHealth, regenerationRate]);

  // Regeneration delay timer
  useEffect(() => {
    let timer: number;
    if (regenerationDelay > 0) {
      timer = setInterval(() => {
        setRegenerationDelay((prev) => {
          if (prev <= 1) {
            setIsRegenerating(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [regenerationDelay]);

  // Log cooldown timer
  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const decreaseHealth = (amount: number) => {
    setWorkerHealth((prev) => Math.max(0, prev - amount));
    setIsRegenerating(false);
    setRegenerationDelay(5); // 5 seconds delay before regeneration starts
  };

  // Calculate upgrade costs
  const getWorkerTrainingCost = () => {
    return 100 * Math.pow(2, workerLevel - 1);
  };

  const getParallelProcessingCost = () => {
    return 200 * Math.pow(2, parallelProcessingLevel - 1);
  };

  const getCooldownReductionCost = () => {
    return 150 * Math.pow(2, cooldownReductionLevel - 1);
  };

  // Calculate actual cooldown based on level
  const getActualCooldown = () => {
    return Math.max(5, baseCooldown - (cooldownReductionLevel - 1) * 5); // Minimum 5 seconds cooldown
  };

  // Update handleClick to use the new cooldown
  const handleClick = () => {
    if (cooldown === 0 && workerHealth >= 20 * parallelProcessingLevel) {
      setLogs(logs + parallelProcessingLevel);
      setCooldown(getActualCooldown());
      decreaseHealth(20 * parallelProcessingLevel);
    }
  };

  const handleLogSplitting = () => {
    if (logs > 0 && currentLog === 0 && workerHealth >= 10) {
      // Start splitting a new log
      setLogs(logs - 1);
      setCurrentLog(5);
      decreaseHealth(10);
    } else if (currentLog > 0 && workerHealth >= 2) {
      // Continue splitting the current log
      setCurrentLog(currentLog - 1);
      setRounds(rounds + 1);
      decreaseHealth(2);
    }
  };

  const handleRoundSplitting = () => {
    if (rounds > 0 && currentRound === 0 && workerHealth >= 5) {
      // Start splitting a new round
      setRounds(rounds - 1);
      setCurrentRound(5);
      decreaseHealth(5);
    } else if (currentRound > 0 && workerHealth >= 1) {
      // Continue splitting the current round
      setCurrentRound(currentRound - 1);
      setWoodPieces(woodPieces + 1);
      decreaseHealth(1);
    }
  };

  const getHealthRequirement = (action: string): number => {
    switch (action) {
      case "cut":
        return 20 * parallelProcessingLevel;
      case "splitLog":
        return 10;
      case "splitRound":
        return 5;
      case "createRound":
        return 2;
      case "createWood":
        return 1;
      default:
        return 0;
    }
  };

  const getDisabledReason = (action: string): string => {
    const healthRequired = getHealthRequirement(action);

    if (workerHealth < healthRequired) {
      return `Worker needs ${healthRequired}% health (current: ${workerHealth}%)`;
    }

    switch (action) {
      case "cut":
        return cooldown > 0 ? `Next log available in ${cooldown}s` : "";
      case "splitLog":
        return logs === 0
          ? "No logs available"
          : currentLog > 0
          ? "Already splitting a log"
          : "";
      case "splitRound":
        return rounds === 0
          ? "No rounds available"
          : currentRound > 0
          ? "Already splitting a round"
          : "";
      case "createRound":
        return currentLog === 0 ? "No log being split" : "";
      case "createWood":
        return currentRound === 0 ? "No round being split" : "";
      default:
        return "";
    }
  };

  // Update upgrade functions
  const upgradeWorker = () => {
    const cost = getWorkerTrainingCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setWorkerLevel((prev) => prev + 1);
      setRegenerationRate((prev) => prev + 0.5);
    }
  };

  const upgradeParallelProcessing = () => {
    const cost = getParallelProcessingCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setParallelProcessingLevel((prev) => prev + 1);
    }
  };

  // Add new upgrade function
  const upgradeCooldownReduction = () => {
    const cost = getCooldownReductionCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setCooldownReductionLevel((prev) => prev + 1);
    }
  };

  // Update disabled reason for Get Log button
  const getLogDisabledReason = () => {
    const healthRequired = 20 * parallelProcessingLevel;
    if (workerHealth < healthRequired) {
      return `Worker needs ${healthRequired}% health (current: ${workerHealth}%)`;
    }
    if (cooldown > 0) {
      return `Next log available in ${cooldown}s`;
    }
    return "";
  };

  const getLogSplittingButtonText = () => {
    if (currentLog > 0) {
      return `Split into Round (${currentLog} left)`;
    }
    return "Start Splitting Log";
  };

  const getRoundSplittingButtonText = () => {
    if (currentRound > 0) {
      return `Split into Wood (${currentRound} left)`;
    }
    return "Start Splitting Round";
  };

  const getLogSplittingDisabledReason = () => {
    if (workerHealth < (currentLog > 0 ? 2 : 10)) {
      return `Worker needs ${
        currentLog > 0 ? 2 : 10
      }% health (current: ${workerHealth}%)`;
    }
    if (currentLog === 0 && logs === 0) {
      return "No logs available";
    }
    return "";
  };

  const getRoundSplittingDisabledReason = () => {
    if (workerHealth < (currentRound > 0 ? 1 : 5)) {
      return `Worker needs ${
        currentRound > 0 ? 1 : 5
      }% health (current: ${workerHealth}%)`;
    }
    if (currentRound === 0 && rounds === 0) {
      return "No rounds available";
    }
    return "";
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Wood Clicker Game</h1>
        <div className="header-content">
          <div className="resources-display">
            <div className="resource-item">
              <span className="resource-icon">🪵</span>
              <span className="resource-count">{logs}</span>
              <span className="resource-label">Logs</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">⭕</span>
              <span className="resource-count">{rounds}</span>
              <span className="resource-label">Rounds</span>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🪚</span>
              <span className="resource-count">{woodPieces}</span>
              <span className="resource-label">Wood Pieces</span>
            </div>
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

      <main className="game-main">
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
                onClick={handleClick}
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
                onClick={handleLogSplitting}
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
                onClick={handleRoundSplitting}
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

        <section className="upgrades-section">
          <h2>Upgrades</h2>
          <div className="upgrades-list">
            <div className="upgrade-item">
              <div className="upgrade-info">
                <h3>Worker Training</h3>
                <p>Improves health regeneration rate</p>
                <div className="upgrade-stats">
                  <div>Current Level: {workerLevel}</div>
                  <div>Regeneration: +{regenerationRate}/s</div>
                  <div>Next Level Cost: {getWorkerTrainingCost()} wood</div>
                </div>
              </div>
              <button
                className="upgrade-button"
                onClick={upgradeWorker}
                disabled={woodPieces < getWorkerTrainingCost()}
              >
                Upgrade ({getWorkerTrainingCost()} wood)
              </button>
              {woodPieces < getWorkerTrainingCost() && (
                <div className="upgrade-requirement">
                  Need {getWorkerTrainingCost() - woodPieces} more wood pieces
                </div>
              )}
            </div>

            <div className="upgrade-item">
              <div className="upgrade-info">
                <h3>Parallel Processing</h3>
                <p>Allows cutting multiple logs at once</p>
                <div className="upgrade-stats">
                  <div>Current Level: {parallelProcessingLevel}</div>
                  <div>Logs per cut: {parallelProcessingLevel}</div>
                  <div>Health cost: {20 * parallelProcessingLevel}%</div>
                  <div>Next Level Cost: {getParallelProcessingCost()} wood</div>
                </div>
              </div>
              <button
                className="upgrade-button"
                onClick={upgradeParallelProcessing}
                disabled={woodPieces < getParallelProcessingCost()}
              >
                Upgrade ({getParallelProcessingCost()} wood)
              </button>
              {woodPieces < getParallelProcessingCost() && (
                <div className="upgrade-requirement">
                  Need {getParallelProcessingCost() - woodPieces} more wood
                  pieces
                </div>
              )}
            </div>

            <div className="upgrade-item">
              <div className="upgrade-info">
                <h3>Efficiency Training</h3>
                <p>Reduces cooldown between log cuts</p>
                <div className="upgrade-stats">
                  <div>Current Level: {cooldownReductionLevel}</div>
                  <div>Cooldown: {getActualCooldown()}s</div>
                  <div>Next Level: {Math.max(5, getActualCooldown() - 5)}s</div>
                  <div>Next Level Cost: {getCooldownReductionCost()} wood</div>
                </div>
              </div>
              <button
                className="upgrade-button"
                onClick={upgradeCooldownReduction}
                disabled={woodPieces < getCooldownReductionCost()}
              >
                Upgrade ({getCooldownReductionCost()} wood)
              </button>
              {woodPieces < getCooldownReductionCost() && (
                <div className="upgrade-requirement">
                  Need {getCooldownReductionCost() - woodPieces} more wood
                  pieces
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
