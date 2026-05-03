import { fireEvent, render, screen } from "@testing-library/react";
import FAQ from "../../src/pages/FAQ/FAQ.jsx";

describe("FAQ", () => {
  it("renders the FAQ sections and toggles accordion items", () => {
    render(<FAQ />);

    const questionText = screen.getByText("What is Merch4Change?");
    const questionButton = questionText.closest("button");

    expect(questionButton).not.toBeNull();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(questionButton.closest(".accordion-item")).not.toHaveClass("open");

    fireEvent.click(questionButton);

    expect(questionButton.closest(".accordion-item")).toHaveClass("open");
    expect(screen.getByText(/Merch4Change is an impact-led commerce platform/)).toBeInTheDocument();

    fireEvent.click(questionButton);

    expect(questionButton.closest(".accordion-item")).not.toHaveClass("open");
  });
});
