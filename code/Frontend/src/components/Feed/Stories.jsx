import { useState } from "react";
import "./Stories.css";
import StoryViewer from "./StoryViewer";
import test from "../../assets/test.jpg";

const STORIES = [
  { id: 1, name: "Elena.V", image: test },
  { id: 2, name: "Marcus_K", image: test },
  { id: 3, name: "Zoe.Studio", image: test },
  { id: 4, name: "Liam.Design", image: test },
  { id: 5, name: "Sarah.Art", image: test },
];

function Stories() {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <>
      <div className="stories-container">
        <div className="story-item">
          <div className="story-img-container add-story">
            <span className="add-plus">+</span>
          </div>
          <p>Your Story</p>
        </div>
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="story-item"
            onClick={() => setActiveStory(story)}
          >
            <div className="story-img-container has-story">
              <img src={story.image} alt="story" />
            </div>
            <p>{story.name}</p>
          </div>
        ))}
      </div>
      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </>
  );
}

export default Stories;
