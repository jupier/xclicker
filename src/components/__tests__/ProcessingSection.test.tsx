import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ProcessingSection } from "../ProcessingSection";

describe("ProcessingSection", () => {
  const defaultProps = {
    cooldown: 0,
    currentLog: 0,
    currentRound: 0,
    logs: 5,
    rounds: 3,
    workerHealth: 100,
    parallelProcessingLevel: 1,
    onGetLog: vi.fn(),
    onSplitLog: vi.fn(),
    onSplitRound: vi.fn(),
    getLogDisabledReason: () => "",
    getLogSplittingDisabledReason: () => "",
    getRoundSplittingDisabledReason: () => "",
    getLogSplittingButtonText: () => "Start Splitting Log",
    getRoundSplittingButtonText: () => "Start Splitting Round",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders processing section title", () => {
    render(<ProcessingSection {...defaultProps} />);
    expect(screen.getByText("Wood Processing")).toBeInTheDocument();
  });

  it("shows cooldown timer when active", () => {
    render(<ProcessingSection {...defaultProps} cooldown={5} />);
    expect(screen.getByText("Next log available in: 5s")).toBeInTheDocument();
  });

  it("enables get log button when conditions are met", () => {
    render(<ProcessingSection {...defaultProps} />);
    const button = screen.getByText(/Get 1 Log/);
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(defaultProps.onGetLog).toHaveBeenCalled();
  });

  it("disables get log button during cooldown", () => {
    render(<ProcessingSection {...defaultProps} cooldown={5} />);
    const button = screen.getByText(/Get 1 Log/);
    expect(button).toBeDisabled();
  });

  it("shows correct text for log splitting based on state", () => {
    const { rerender } = render(<ProcessingSection {...defaultProps} />);
    expect(screen.getByText("Start Splitting Log")).toBeInTheDocument();

    rerender(
      <ProcessingSection
        {...defaultProps}
        getLogSplittingButtonText={() => "Split into Round (2 left)"}
      />
    );
    expect(screen.getByText("Split into Round (2 left)")).toBeInTheDocument();
  });

  it("shows correct text for round splitting based on state", () => {
    const { rerender } = render(<ProcessingSection {...defaultProps} />);
    expect(screen.getByText("Start Splitting Round")).toBeInTheDocument();

    rerender(
      <ProcessingSection
        {...defaultProps}
        getRoundSplittingButtonText={() => "Split into Wood (2 left)"}
      />
    );
    expect(screen.getByText("Split into Wood (2 left)")).toBeInTheDocument();
  });

  it("calls appropriate handlers when buttons are clicked", () => {
    render(<ProcessingSection {...defaultProps} />);

    fireEvent.click(screen.getByText(/Get 1 Log/));
    expect(defaultProps.onGetLog).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Start Splitting Log"));
    expect(defaultProps.onSplitLog).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Start Splitting Round"));
    expect(defaultProps.onSplitRound).toHaveBeenCalled();
  });

  it("shows tooltips with disabled reasons", () => {
    render(
      <ProcessingSection
        {...defaultProps}
        getLogDisabledReason={() => "Not enough health"}
        getLogSplittingDisabledReason={() => "No logs available"}
        getRoundSplittingDisabledReason={() => "No rounds available"}
      />
    );

    expect(screen.getByText("Not enough health")).toBeInTheDocument();
    expect(screen.getByText("No logs available")).toBeInTheDocument();
    expect(screen.getByText("No rounds available")).toBeInTheDocument();
  });
});
