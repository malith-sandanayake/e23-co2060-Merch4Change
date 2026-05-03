import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SelectSignUp from "../../src/pages/SelectSignUp/SelectSignUp.jsx";

describe("SelectSignUp", () => {
  it("renders the role selection page with heading", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Which role do you act/i)).toBeInTheDocument();
    expect(screen.getByText(/Customize your experience/i)).toBeInTheDocument();
  });

  it("displays both organization and user signup cards", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Create account as an Organization/i)).toBeInTheDocument();
    expect(screen.getByText(/Create account as a User/i)).toBeInTheDocument();
    expect(screen.getByText(/Fund raising and project management/i)).toBeInTheDocument();
    expect(screen.getByText(/Buy, sell and donate items/i)).toBeInTheDocument();
  });

  it("shows login prompt with link to login page", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Log in here/i)).toBeInTheDocument();
  });

  it("displays role icons on selection cards", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    expect(screen.getByText("🏢")).toBeInTheDocument();
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("displays navigation arrows on cards", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    const arrows = screen.getAllByText("→");
    expect(arrows).toHaveLength(2);
  });

  it("cards are clickable and have cursor pointer style", () => {
    render(
      <MemoryRouter>
        <SelectSignUp />
      </MemoryRouter>,
    );

    const orgCard = screen.getByText(/Create account as an Organization/i).closest(".section1");
    const userCard = screen.getByText(/Create account as a User/i).closest(".section2");

    expect(orgCard).toHaveStyle({ cursor: "pointer" });
    expect(userCard).toHaveStyle({ cursor: "pointer" });
  });
});
