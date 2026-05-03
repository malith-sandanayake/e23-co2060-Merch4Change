import { render, screen } from "@testing-library/react";
import Team from "../../src/pages/About/Team.jsx";

describe("Team", () => {
  it("renders the Team Antigravity heading", () => {
    render(<Team />);

    expect(screen.getByText("Team Antigravity")).toBeInTheDocument();
  });

  it("displays the team tagline", () => {
    render(<Team />);

    expect(screen.getByText("The passionate individuals driving Merch4Change.")).toBeInTheDocument();
  });

  it("displays the under construction message", () => {
    render(<Team />);

    expect(screen.getByText(/🚧 Under Construction 🚧/)).toBeInTheDocument();
  });

  it("displays the construction notice text", () => {
    render(<Team />);

    expect(screen.getByText(/We're currently updating our team profiles/)).toBeInTheDocument();
    expect(screen.getByText(/Check back soon to meet the minds behind the mission/)).toBeInTheDocument();
  });

  it("applies animate-in class when component mounts", () => {
    const { container } = render(<Team />);

    const aboutPage = container.querySelector(".about-page");
    expect(aboutPage).toHaveClass("animate-in");
  });
});
