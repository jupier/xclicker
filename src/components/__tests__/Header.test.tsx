import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header", () => {
  const defaultProps = {
    logs: 10,
    rounds: 5,
    woodPieces: 20,
    workerHealth: 80,
    regenerationDelay: 0,
    isRegenerating: false,
    workerLevel: 2,
  };

  it("renders all resource counts", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("10")).toBeInTheDocument(); // Logs
    expect(screen.getByText("5")).toBeInTheDocument(); // Rounds
    expect(screen.getByText("20")).toBeInTheDocument(); // Wood Pieces
  });

  it("displays worker health correctly", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Health: 80%")).toBeInTheDocument();
  });

  it("shows regeneration status when regenerating", () => {
    render(
      <Header {...defaultProps} isRegenerating={true} workerHealth={90} />
    );
    expect(screen.getByText(/Regenerating/)).toBeInTheDocument();
  });

  it("shows regeneration delay when applicable", () => {
    render(<Header {...defaultProps} regenerationDelay={3} />);
    expect(screen.getByText(/Regenerating in 3s/)).toBeInTheDocument();
  });

  it("displays worker level", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Level: 2")).toBeInTheDocument();
  });
});
