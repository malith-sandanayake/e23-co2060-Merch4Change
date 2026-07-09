import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Stories.css";
import StoryViewer from "./StoryViewer";
import story1 from "../../assets/welcome_stories/merch4change_story1_welcome.svg";
import story2 from "../../assets/welcome_stories/merch4change_story2_what_we_do.svg";
import story3 from "../../assets/welcome_stories/merch4change_story3_every_purchase.svg";
import story4 from "../../assets/welcome_stories/merch4change_story4_our_charities.svg";
import story5 from "../../assets/welcome_stories/merch4change_story5_join_the_movement.svg";
import { uploadStory, getStories } from "../../api/storyService";
import { toast } from "react-hot-toast";

const STATIC_STORIES = [
  { _id: "static_1", name: "Welcome", image: story1, isStatic: true },
  { _id: "static_2", name: "What We Do", image: story2, isStatic: true },
  { _id: "static_3", name: "Every Purchase", image: story3, isStatic: true },
  { _id: "static_4", name: "Our Charities", image: story4, isStatic: true },
  { _id: "static_5", name: "Join The Movement", image: story5, isStatic: true },
];

function Stories() {
  const [activeStory, setActiveStory] = useState(null);
  const [dynamicStories, setDynamicStories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [seenStories, setSeenStories] = useState(() => {
    const saved = localStorage.getItem("merch4change_seen_stories");
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef(null);

  const fetchStories = async () => {
    try {
      const data = await getStories();
      if (data && data.data && data.data.stories) {
        // Map backend story format to frontend format
        const formattedStories = data.data.stories.map((story) => ({
          _id: story._id,
          name: story.userId ? `${story.userId.firstName} ${story.userId.lastName}` : "User",
          image: story.image,
          userImage: story.userId?.profileImageUrl,
          isStatic: false,
        }));
        setDynamicStories(formattedStories);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: add some basic file validation here (e.g. size < 5MB)
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    const loadingToast = toast.loading("Uploading story...");

    try {
      await uploadStory(formData);
      toast.success("Story uploaded!", { id: loadingToast });
      fetchStories(); // refresh stories list
    } catch (error) {
      toast.error("Failed to upload story", { id: loadingToast });
      console.error(error);
    } finally {
      setIsUploading(false);
      // reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddStoryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleStoryClick = (story) => {
    setActiveStory(story);
    if (!seenStories.includes(story._id)) {
      const newSeen = [...seenStories, story._id];
      setSeenStories(newSeen);
      localStorage.setItem("merch4change_seen_stories", JSON.stringify(newSeen));
    }
  };

  const allStories = [...dynamicStories, ...STATIC_STORIES];
  
  // Sort stories: unseen first, seen last
  const sortedStories = [...allStories].sort((a, b) => {
    const aSeen = seenStories.includes(a._id);
    const bSeen = seenStories.includes(b._id);
    if (aSeen && !bSeen) return 1;
    if (!aSeen && bSeen) return -1;
    return 0; // maintain original order for ties (newest first for dynamic, static order for static)
  });

  return (
    <>
      <div className="stories-container">
        <div className="story-item" onClick={handleAddStoryClick} style={{ cursor: isUploading ? 'wait' : 'pointer' }}>
          <div className="story-img-container add-story">
            <span className="add-plus">{isUploading ? "..." : "+"}</span>
          </div>
          <p>Your Story</p>
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: "none" }} 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
        {sortedStories.map((story) => {
          const isSeen = seenStories.includes(story._id);
          return (
            <div
              key={story._id}
              className="story-item"
              onClick={() => handleStoryClick(story)}
            >
              <div className={`story-img-container ${isSeen ? 'seen-story' : 'has-story'}`}>
                <img src={story.image} alt="story" style={{ objectFit: 'cover' }} />
              </div>
              <p>{story.name}</p>
            </div>
          );
        })}
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
