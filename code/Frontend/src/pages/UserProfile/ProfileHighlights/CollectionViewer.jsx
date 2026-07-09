import React, { useState, useEffect } from 'react';
import '../../../components/Feed/StoryViewer.css';

function CollectionViewer({ collection, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = collection.stories || [];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose(); // auto close when reached the end
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (stories.length === 0) {
    return (
      <div className="sv-overlay" onClick={onClose}>
        <div className="sv-card" onClick={(e) => e.stopPropagation()}>
          <button className="sv-close" onClick={onClose}>×</button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
            No stories in this collection
          </div>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="sv-overlay" onClick={onClose}>
      <div className="sv-card" onClick={(e) => e.stopPropagation()}>
        {/* Simple Progress Indicators */}
        <div style={{ display: 'flex', gap: '4px', position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 20 }}>
          {stories.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                flex: 1, 
                height: '3px', 
                background: i <= currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                borderRadius: '2px'
              }} 
            />
          ))}
        </div>

        <button className="sv-close" onClick={onClose}>×</button>

        <img className="sv-image" src={currentStory.image} alt={collection.title} />

        {/* Navigation Overlays */}
        <div 
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', zIndex: 15, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        />
        <div 
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%', zIndex: 15, cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
        />

        <div className="sv-label" style={{ zIndex: 20 }}>
          {collection.title} - {currentIndex + 1}/{stories.length}
        </div>
      </div>
    </div>
  );
}

export default CollectionViewer;
