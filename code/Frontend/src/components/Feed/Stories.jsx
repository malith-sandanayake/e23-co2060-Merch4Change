import "./Stories.css";
import test from "../../assets/test.jpg";

function Stories() {
  return (
    <div className="stories-container">
      <div className="story-item">
        <div className="story-img-container add-story">
          <span className="add-plus">+</span>
        </div>
        <p>Your Story</p>
      </div>
      <div className="story-item">
        <div className="story-img-container has-story">
          <img src={test} alt="story" />
        </div>
        <p>Elena.V</p>
      </div>
      <div className="story-item">
        <div className="story-img-container has-story">
          <img src={test} alt="story" />
        </div>
        <p>Marcus_K</p>
      </div>
      <div className="story-item">
        <div className="story-img-container has-story">
          <img src={test} alt="story" />
        </div>
        <p>Zoe.Studio</p>
      </div>
      <div className="story-item">
        <div className="story-img-container has-story">
          <img src={test} alt="story" />
        </div>
        <p>Liam.Design</p>
      </div>
    </div>
  );
}

export default Stories;
