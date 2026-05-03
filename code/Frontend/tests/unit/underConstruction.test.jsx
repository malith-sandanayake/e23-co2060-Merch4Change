import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UnderConstruction from "../../src/components/UnderConstruction/UnderConstruction.jsx";

describe("UnderConstruction", () => {
  beforeEach(() => {
    // Mock canvas getContext to prevent errors in jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    }));
  });

  it("renders the under construction heading", () => {
    render(<UnderConstruction />);

    expect(screen.getByText(/Under Construction/i)).toBeInTheDocument();
  });

  it("displays the lucide heart and hammer icons", () => {
    render(<UnderConstruction />);

    const heartIcon = document.querySelector(".lucide-heart");
    const hammerIcon = document.querySelector(".lucide-hammer");
    
    expect(heartIcon).toBeInTheDocument();
    expect(hammerIcon).toBeInTheDocument();
  });

  it("displays the heading and badge text", () => {
    render(<UnderConstruction />);

    // Check for key text elements
    expect(screen.getByText("Under Construction")).toBeInTheDocument();
    expect(screen.getByText("Merch4Change")).toBeInTheDocument();
    
    // Verify footer copyright text
    const footerText = screen.getByText(/Give directly to causes/);
    expect(footerText).toBeInTheDocument();
  });

  it("renders the canvas element for particle animation", () => {
    render(<UnderConstruction />);

    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("applies correct styling with under construction container", () => {
    const { container } = render(<UnderConstruction />);

    const mainDiv = container.querySelector("div[style*='min-height']");
    expect(mainDiv).toBeInTheDocument();
  });
});
