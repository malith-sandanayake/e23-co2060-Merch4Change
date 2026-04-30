import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";

function PublicLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to anchors
  useEffect(() => {
    if (!location.hash) {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const elementId = location.hash.replace("#", "");

    requestAnimationFrame(() => {
      const target = document.getElementById(elementId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [location.pathname, location.hash]);

  return (
    <>
      {!hideNavbar && <Navbar scrolled={scrolled} />}
      <Outlet />
    </>
  );
}

export default PublicLayout;

