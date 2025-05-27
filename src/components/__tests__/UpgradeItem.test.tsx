import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { UpgradeItem } from "../UpgradeItem";

describe("UpgradeItem", () => {
  const defaultProps = {
    title: "Test Upgrade",
    description: "Test Description",
    stats: ["Stat 1: 10", "Stat 2: 20"],
    cost: 100,
    woodPieces: 50,
    onUpgrade: vi.fn(),
  };

  it("renders upgrade information correctly", () => {
    render(<UpgradeItem {...defaultProps} />);

    expect(screen.getByText("Test Upgrade")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Stat 1: 10")).toBeInTheDocument();
    expect(screen.getByText("Stat 2: 20")).toBeInTheDocument();
    expect(screen.getByText("Next Level Cost: 100 wood")).toBeInTheDocument();
  });

  it("disables button when not enough wood pieces", () => {
    render(<UpgradeItem {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("enables button when enough wood pieces", () => {
    render(<UpgradeItem {...defaultProps} woodPieces={150} />);
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  it("calls onUpgrade when clicked with sufficient resources", () => {
    render(<UpgradeItem {...defaultProps} woodPieces={150} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(defaultProps.onUpgrade).toHaveBeenCalled();
  });

  it("shows requirement message when not enough wood", () => {
    render(<UpgradeItem {...defaultProps} />);
    expect(screen.getByText("Need 50 more wood pieces")).toBeInTheDocument();
  });
});
