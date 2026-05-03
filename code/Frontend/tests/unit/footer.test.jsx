import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../../src/components/Footer/Footer.jsx";

describe("Footer", () => {
  it("renders the Merch4Change branding", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Merch4Change")).toBeInTheDocument();
    expect(screen.getByText(/Empowering communities through impact-led commerce/)).toBeInTheDocument();
  });

  it("displays footer navigation columns", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("displays footer links for navigation", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Our Story")).toBeInTheDocument();
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText("Team Antigravity")).toBeInTheDocument();
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("FAQs")).toBeInTheDocument();
  });

  it("displays copyright information with current year", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear} Merch4Change`))).toBeInTheDocument();
  });

  it("displays social media icons", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const socialIcons = screen.getAllByText(/IN|TW|FB|IG/);
    expect(socialIcons.length).toBeGreaterThan(0);
  });

  it("displays legal links section", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
  });
});
