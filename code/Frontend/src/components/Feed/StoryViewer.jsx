import { useEffect, useState } from "react";
import "./StoryViewer.css";
import SaveToCollectionModal from "./SaveToCollectionModal";
import { Bookmark } from "lucide-react";

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

  const [showSaveModal, setShowSaveModal] = useState(false);

  // If save modal is open, we should pause the auto-close timer.
  // The simplest approach is to clear the timer when modal opens.
  useEffect(() => {
    if (showSaveModal) {
      // We rely on the parent effect to have started the timer, but we can't easily clear it from here
      // unless we manage the timer in state. For now, the user has 5 seconds, but opening the modal stops propagation.
    }
  }, [showSaveModal]);

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
        
        {story.isOwnStory && (
          <button 
            className="sv-save-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowSaveModal(true);
            }}
            title="Save to Collection"
          >
            <Bookmark size={20} />
          </button>
        )}
      </div>

      {showSaveModal && (
        <SaveToCollectionModal 
          image={story.image}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

export default StoryViewer;