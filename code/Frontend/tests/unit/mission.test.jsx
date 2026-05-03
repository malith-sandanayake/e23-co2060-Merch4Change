import { render, screen } from "@testing-library/react";
import Mission from "../../src/pages/About/Mission.jsx";

describe("Mission", () => {
  it("renders the Our Mission heading", () => {
    render(<Mission />);

    expect(screen.getByText("Our Mission")).toBeInTheDocument();
  });

  it("displays the mission tagline", () => {
    render(<Mission />);

    expect(screen.getByText("Driving impact-led commerce globally.")).toBeInTheDocument();
  });

  it("displays all three mission cards", () => {
    render(<Mission />);

    expect(screen.getByText("Global Impact")).toBeInTheDocument();
    expect(screen.getByText("Empowering Connections")).toBeInTheDocument();
    expect(screen.getByText("Sustainable Commerce")).toBeInTheDocument();
  });

  it("displays mission card icons", () => {
    render(<Mission />);

    expect(screen.getByText("🌍")).toBeInTheDocument();
    expect(screen.getByText("🤝")).toBeInTheDocument();
    expect(screen.getByText("♻️")).toBeInTheDocument();
  });

  it("displays Global Impact mission description", () => {
    render(<Mission />);

    expect(screen.getByText(/Connecting local communities with global resources/)).toBeInTheDocument();
  });

  it("displays Empowering Connections mission description", () => {
    render(<Mission />);

    expect(screen.getByText(/Fostering powerful partnerships between socially-conscious brands/)).toBeInTheDocument();
  });

  it("displays Sustainable Commerce mission description", () => {
    render(<Mission />);

    expect(screen.getByText(/Promoting eco-friendly and ethically sourced merchandise/)).toBeInTheDocument();
  });

  it("applies animate-in class when component mounts", () => {
    const { container } = render(<Mission />);

    const aboutPage = container.querySelector(".about-page");
    expect(aboutPage).toHaveClass("animate-in");
  });
});
