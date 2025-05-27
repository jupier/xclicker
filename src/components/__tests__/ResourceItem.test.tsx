import { render, screen } from "@testing-library/react";
import { ResourceItem } from "../ResourceItem";

describe("ResourceItem", () => {
  it("renders resource with correct icon, count, and label", () => {
    render(<ResourceItem icon="🪵" count={42} label="Logs" />);

    expect(screen.getByText("🪵")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Logs")).toBeInTheDocument();
  });

  it("updates when count changes", () => {
    const { rerender } = render(
      <ResourceItem icon="🪵" count={42} label="Logs" />
    );
    expect(screen.getByText("42")).toBeInTheDocument();

    rerender(<ResourceItem icon="🪵" count={43} label="Logs" />);
    expect(screen.getByText("43")).toBeInTheDocument();
  });
});
