import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "../../src/components/PublicLayout/PublicLayout.jsx";

describe("PublicLayout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the navbar on public pages and scrolls to the top on the landing page", () => {
    const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<div>Landing content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Merch4Change" })).toBeInTheDocument();
    expect(screen.getByText("Landing content")).toBeInTheDocument();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("hides the navbar on the login page", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<div>Login content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: "Merch4Change" })).not.toBeInTheDocument();
    expect(screen.getByText("Login content")).toBeInTheDocument();
  });
});
