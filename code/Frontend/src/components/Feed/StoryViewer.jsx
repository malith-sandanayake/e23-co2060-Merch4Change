import { useEffect } from "react";
import "./StoryViewer.css";

function StoryViewer({ story, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="sv-overlay" onClick={onClose}>
      <div className="sv-card" onClick={(e) => e.stopPropagation()}>
        <div className="sv-progress">
          <div className="sv-progress-fill" />
        </div>

        <button className="sv-close" onClick={onClose}>
          ×
        </button>

        <img className="sv-image" src={story.image} alt={story.name} />

        <div className="sv-label">{story.name}</div>
      </div>
    </div>
  );
}

export default StoryViewer;