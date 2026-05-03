import "./Feed.css";
import Stories from "./Stories";
import PromoBanner from "./PromoBanner";
import PostsGrid from "./PostsGrid";
import TrendingNow from "./TrendingNow";

function Feed() {
  return (
    <div className="center-feed">
      <Stories />
      <PromoBanner />
      <PostsGrid />
      <TrendingNow />
    </div>
  );
}

export default Feed;
