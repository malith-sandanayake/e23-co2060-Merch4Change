import { render, screen } from "@testing-library/react";
import OurStory from "../../src/pages/About/OurStory.jsx";

describe("OurStory", () => {
  it("renders the Our Story heading", () => {
    render(<OurStory />);

    expect(screen.getByText("Our Story")).toBeInTheDocument();
  });

  it("displays the story tagline", () => {
    render(<OurStory />);

    expect(screen.getByText("How a simple idea grew into a movement for change.")).toBeInTheDocument();
  });

  it("displays the three content sections", () => {
    render(<OurStory />);

    expect(screen.getByText("The Beginning")).toBeInTheDocument();
    expect(screen.getByText("Our Vision")).toBeInTheDocument();
    expect(screen.getByText("The Journey Ahead")).toBeInTheDocument();
  });

  it("displays the beginning section content", () => {
    render(<OurStory />);

    expect(screen.getByText(/Merch4Change was born out of a desire to bridge the gap/)).toBeInTheDocument();
  });

  it("displays the vision section content", () => {
    render(<OurStory />);

    expect(screen.getByText(/Our goal is to create a seamless platform/)).toBeInTheDocument();
  });

  it("displays the journey section content", () => {
    render(<OurStory />);

    expect(screen.getByText(/We are constantly expanding our network of charities and brands/)).toBeInTheDocument();
  });

  it("applies animate-in class when component mounts", () => {
    const { container } = render(<OurStory />);

    const aboutPage = container.querySelector(".about-page");
    expect(aboutPage).toHaveClass("animate-in");
  });
});
