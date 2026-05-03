import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Stories.css";
import StoryViewer from "./StoryViewer";
import story1 from "../../assets/welcome_stories/merch4change_story1_welcome.svg";
import story2 from "../../assets/welcome_stories/merch4change_story2_what_we_do.svg";
import story3 from "../../assets/welcome_stories/merch4change_story3_every_purchase.svg";
import story4 from "../../assets/welcome_stories/merch4change_story4_our_charities.svg";
import story5 from "../../assets/welcome_stories/merch4change_story5_join_the_movement.svg";

const STORIES = [
  { id: 1, name: "Welcome", image: story1 },
  { id: 2, name: "What We Do", image: story2 },
  { id: 3, name: "Every Purchase", image: story3 },
  { id: 4, name: "Our Charities", image: story4 },
  { id: 5, name: "Join The Movement", image: story5 },
];

function Stories() {
  const [activeStory, setActiveStory] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="stories-container">
        <div className="story-item" onClick={() => navigate('/under-construction')}>
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
