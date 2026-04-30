import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Navbar/Navbar";

function PublicLayout() {
  const location = useLocation();

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
      <Navbar />
      <Outlet />
    </>
  );
}

export default PublicLayout;
