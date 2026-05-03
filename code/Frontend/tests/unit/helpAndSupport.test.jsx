import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HelpAndSupport from "../../src/pages/HelpAndSupport/HelpAndSupport.jsx";

describe("HelpAndSupport", () => {
  it("renders the help page heading", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    expect(screen.getByText("How can we help you today?")).toBeInTheDocument();
  });

  it("displays the search bar with placeholder text", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Search for articles, guides or FAQs...");
    expect(searchInput).toBeInTheDocument();
  });

  it("displays help category cards with icons", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("FAQs")).toBeInTheDocument();
    expect(screen.getByText("Contact Support")).toBeInTheDocument();
    expect(screen.getByText("📚")).toBeInTheDocument();
    expect(screen.getByText("❓")).toBeInTheDocument();
    expect(screen.getByText("✉️")).toBeInTheDocument();
  });

  it("displays help category descriptions", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Learn the basics of using Merch4Change/)).toBeInTheDocument();
    expect(screen.getByText(/Find answers to the most frequently asked questions/)).toBeInTheDocument();
    expect(screen.getByText(/Can't find what you need/)).toBeInTheDocument();
  });

  it("displays popular guides section", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    expect(screen.getByText("Popular Guides")).toBeInTheDocument();
    expect(screen.getByText("How to setup your organization profile")).toBeInTheDocument();
    expect(screen.getByText("Connecting with partner brands")).toBeInTheDocument();
    expect(screen.getByText("Managing your charity campaigns")).toBeInTheDocument();
    expect(screen.getByText("Understanding shipping and delivery")).toBeInTheDocument();
  });

  it("displays search button", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    const searchButton = screen.getByRole("button", { name: "Search" });
    expect(searchButton).toBeInTheDocument();
  });

  it("search input can be typed into", () => {
    render(
      <MemoryRouter>
        <HelpAndSupport />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Search for articles, guides or FAQs...");
    fireEvent.change(searchInput, { target: { value: "account" } });

    expect(searchInput.value).toBe("account");
  });
});
