import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../src/components/Navbar/Navbar.jsx";

describe("Navbar", () => {
  it("renders the Merch4Change brand and navigation buttons", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Merch4Change" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("shows navigation links on the landing page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar scrolled={false} />
      </MemoryRouter>,
    );

    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
    expect(screen.getByText("For Organisations")).toBeInTheDocument();
    expect(screen.getByText("Impact")).toBeInTheDocument();
  });

  it("toggles mobile menu when menu button is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar scrolled={false} />
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    const allHowItWorks = screen.getAllByText("How it works");
    const mobileLink = allHowItWorks.find(el => el.classList.contains("lp-navbar-mobile-link"));
    expect(mobileLink).toBeInTheDocument();

    fireEvent.click(toggleButton);
  });

  it("applies scrolled styling when scrolled prop is true", () => {
    render(
      <MemoryRouter>
        <Navbar scrolled={true} />
      </MemoryRouter>,
    );

    const navbar = screen.getByRole("button", { name: "Merch4Change" }).closest(".lp-navbar");
    expect(navbar).toHaveClass("lp-navbar--scrolled");
  });

  it("does not render navigation links on non-landing pages", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Navbar scrolled={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("How it works")).not.toBeInTheDocument();
  });
});
