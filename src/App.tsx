import { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { ProcessingSection } from "./components/ProcessingSection";
import { UpgradesSection } from "./components/UpgradesSection";
import { AdminPanel } from "./components/AdminPanel";

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
  const [regenerationRate, setRegenerationRate] = useState(2); // Increased initial regen rate
  const [parallelProcessingLevel, setParallelProcessingLevel] = useState(1);
  const [cooldownReductionLevel, setCooldownReductionLevel] = useState(1);
  const [isInstantCooldown, setIsInstantCooldown] = useState(false);
  const baseCooldown = 10; // Reduced from 30 to 10 seconds

  // Health regeneration timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRegenerating && workerHealth < 100) {
      timer = setInterval(() => {
        setWorkerHealth((prev) => Math.min(100, prev + regenerationRate));
      }, 500); // Reduced from 1000ms to 500ms for faster regen
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRegenerating, workerHealth, regenerationRate]);

  // Regeneration delay timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (regenerationDelay > 0) {
      timer = setInterval(() => {
        setRegenerationDelay((prev) => {
          if (prev <= 1) {
            setIsRegenerating(true);
            return 0;
          }
          return prev - 1;
        });
      }, 500); // Reduced from 1000ms to 500ms
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [regenerationDelay]);

  // Log cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (cooldown > 0 && !isInstantCooldown) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 500); // Reduced from 1000ms to 500ms
    } else if (isInstantCooldown && cooldown > 0) {
      setCooldown(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown, isInstantCooldown]);

  const decreaseHealth = (amount: number) => {
    setWorkerHealth((prev) => Math.max(0, prev - amount));
    setIsRegenerating(false);
    setRegenerationDelay(2); // Reduced from 5 to 2 seconds
  };

  // Calculate upgrade costs - made cheaper
  const getWorkerTrainingCost = () => {
    return 50 * Math.pow(1.8, workerLevel - 1);
  };

  const getParallelProcessingCost = () => {
    return 100 * Math.pow(1.8, parallelProcessingLevel - 1);
  };

  const getCooldownReductionCost = () => {
    return 75 * Math.pow(1.8, cooldownReductionLevel - 1);
  };

  // Calculate actual cooldown based on level - more reduction per level
  const getActualCooldown = () => {
    return Math.max(2, baseCooldown - (cooldownReductionLevel - 1) * 2); // More reduction per level, minimum 2 seconds
  };

  const handleClick = () => {
    if (cooldown === 0 && workerHealth >= 15 * parallelProcessingLevel) {
      // Reduced health cost
      setLogs(logs + parallelProcessingLevel * 2); // Double the logs per click
      setCooldown(isInstantCooldown ? 0 : getActualCooldown());
      decreaseHealth(15 * parallelProcessingLevel);
    }
  };

  const handleLogSplitting = () => {
    if (logs > 0 && currentLog === 0 && workerHealth >= 8) {
      // Reduced health costs
      setLogs(logs - 1);
      setCurrentLog(3); // Reduced from 5 to 3 steps
      decreaseHealth(8);
    } else if (currentLog > 0 && workerHealth >= 2) {
      setCurrentLog(currentLog - 1);
      setRounds(rounds + 2); // Double the rounds output
      decreaseHealth(2);
    }
  };

  const handleRoundSplitting = () => {
    if (rounds > 0 && currentRound === 0 && workerHealth >= 4) {
      // Reduced health costs
      setRounds(rounds - 1);
      setCurrentRound(3); // Reduced from 5 to 3 steps
      decreaseHealth(4);
    } else if (currentRound > 0 && workerHealth >= 1) {
      setCurrentRound(currentRound - 1);
      setWoodPieces(woodPieces + 2); // Double the wood pieces output
      decreaseHealth(1);
    }
  };

  const getLogDisabledReason = () => {
    const healthRequired = 15 * parallelProcessingLevel;
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
    if (workerHealth < (currentLog > 0 ? 2 : 8)) {
      return `Worker needs ${
        currentLog > 0 ? 2 : 8
      }% health (current: ${workerHealth}%)`;
    }
    if (currentLog === 0 && logs === 0) {
      return "No logs available";
    }
    return "";
  };

  const getRoundSplittingDisabledReason = () => {
    if (workerHealth < (currentRound > 0 ? 1 : 4)) {
      return `Worker needs ${
        currentRound > 0 ? 1 : 4
      }% health (current: ${workerHealth}%)`;
    }
    if (currentRound === 0 && rounds === 0) {
      return "No rounds available";
    }
    return "";
  };

  const upgradeWorker = () => {
    const cost = getWorkerTrainingCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setWorkerLevel((prev) => prev + 1);
      setRegenerationRate((prev) => prev + 1); // Doubled regen rate increase
    }
  };

  const upgradeParallelProcessing = () => {
    const cost = getParallelProcessingCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setParallelProcessingLevel((prev) => prev + 1);
    }
  };

  const upgradeCooldownReduction = () => {
    const cost = getCooldownReductionCost();
    if (woodPieces >= cost) {
      setWoodPieces((prev) => prev - cost);
      setCooldownReductionLevel((prev) => prev + 1);
    }
  };

  // Admin panel handlers
  const handleAddResources = (
    logsToAdd: number,
    roundsToAdd: number,
    woodToAdd: number
  ) => {
    setLogs((prev) => prev + logsToAdd);
    setRounds((prev) => prev + roundsToAdd);
    setWoodPieces((prev) => prev + woodToAdd);
  };

  const handleSetWorkerStats = (
    health: number,
    level: number,
    regenRate: number
  ) => {
    setWorkerHealth(health);
    setWorkerLevel(level);
    setRegenerationRate(regenRate);
  };

  const handleSetUpgradeLevels = (parallel: number, cooldown: number) => {
    setParallelProcessingLevel(parallel);
    setCooldownReductionLevel(cooldown);
  };

  return (
    <div className="game-container">
      <AdminPanel
        onAddResources={handleAddResources}
        onSetWorkerStats={handleSetWorkerStats}
        onSetUpgradeLevels={handleSetUpgradeLevels}
        onToggleInstantCooldown={() => setIsInstantCooldown((prev) => !prev)}
        isInstantCooldown={isInstantCooldown}
      />

      <Header
        logs={logs}
        rounds={rounds}
        woodPieces={woodPieces}
        workerHealth={workerHealth}
        regenerationDelay={regenerationDelay}
        isRegenerating={isRegenerating}
        workerLevel={workerLevel}
      />

      <main className="game-main">
        <ProcessingSection
          cooldown={cooldown}
          currentLog={currentLog}
          currentRound={currentRound}
          logs={logs}
          rounds={rounds}
          workerHealth={workerHealth}
          parallelProcessingLevel={parallelProcessingLevel}
          onGetLog={handleClick}
          onSplitLog={handleLogSplitting}
          onSplitRound={handleRoundSplitting}
          getLogDisabledReason={getLogDisabledReason}
          getLogSplittingDisabledReason={getLogSplittingDisabledReason}
          getRoundSplittingDisabledReason={getRoundSplittingDisabledReason}
          getLogSplittingButtonText={getLogSplittingButtonText}
          getRoundSplittingButtonText={getRoundSplittingButtonText}
        />

        <UpgradesSection
          woodPieces={woodPieces}
          workerLevel={workerLevel}
          regenerationRate={regenerationRate}
          parallelProcessingLevel={parallelProcessingLevel}
          cooldownReductionLevel={cooldownReductionLevel}
          getWorkerTrainingCost={getWorkerTrainingCost}
          getParallelProcessingCost={getParallelProcessingCost}
          getCooldownReductionCost={getCooldownReductionCost}
          getActualCooldown={getActualCooldown}
          onUpgradeWorker={upgradeWorker}
          onUpgradeParallelProcessing={upgradeParallelProcessing}
          onUpgradeCooldownReduction={upgradeCooldownReduction}
        />
      </main>
    </div>
  );
}

export default App;
