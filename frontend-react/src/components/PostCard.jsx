import { Link } from "react-router-dom";

const readingTime = (content = "") => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const PostCard = ({ post }) => {
  const photoSrc = post.photo
    ? post.photo.startsWith("http") ? post.photo : `http://localhost:5000${post.photo}`
    : null;

  const excerpt = post.content?.slice(0, 120) + (post.content?.length > 120 ? "…" : "");

  return (
    <Link to={`/post/${post._id}`} className="card">
      <div className="card-img-wrap">
        {photoSrc
          ? <img src={photoSrc} alt={post.title} loading="lazy" />
          : <div className="card-no-img">📝</div>
        }
      </div>
      <div className="card-body">
        <div className="card-tag">Article</div>
        <h2 className="card-title">{post.title || "Untitled"}</h2>
        <p className="card-excerpt">{excerpt}</p>
        <div className="card-footer">
          <div className="card-author">
            <div className="card-avatar">{post.author?.name?.[0]?.toUpperCase()}</div>
            <span className="card-author-name">{post.author?.name || "Unknown"}</span>
          </div>
          <div className="card-stats">
            <span className="card-stat">❤️ {post.likes?.length || 0}</span>
            <span className="card-stat">⏱ {readingTime(post.content)}m</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
