import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CommentSection from "../components/CommentSection";
import { Spinner, Alert } from "../components/UI";
import api from "../api/axios";
import { io } from "socket.io-client";

const readingTime = (content = "") => Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const PostDetail = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();

  const [post, setPost]         = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [liked, setLiked]       = useState(false);
  const [likes, setLikes]       = useState(0);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLikes(postRes.data.likes?.length || 0);
        setLiked(user ? postRes.data.likes?.some((l) => l.toString() === user.id) : false);
      } catch (err) {
        setError(err.response?.data?.msg || "Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("join_post", id);
    socket.on("like_updated", ({ likes: n }) => setLikes(n));
    socket.on("new_comment", (c) => setComments((prev) => [...prev, c]));
    return () => { socket.emit("leave_post", id); socket.disconnect(); };
  }, [id]);

  const toggleLike = async () => {
    if (!user) return navigate("/login");
    const res = await api.post(`/posts/${id}/like`);
    setLiked(res.data.liked);
    setLikes(res.data.likes);
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    const res = await api.post(`/posts/${id}/save`);
    setSaved(res.data.saved);
    addToast(res.data.saved ? "Post saved!" : "Post unsaved", res.data.saved ? "success" : "info");
  };

  const deletePost = async () => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${id}`);
    addToast("Post deleted", "info");
    navigate("/");
  };

  if (loading) return <Spinner />;
  if (error)   return <div className="container"><Alert msg={error} /></div>;

  const isOwner = user && (user.id === post.author?._id?.toString() || user.role === "admin");
  const photoSrc = post.photo ? (post.photo.startsWith("http") ? post.photo : `http://localhost:5000${post.photo}`) : null;

  return (
    <div className="container">
      <Link to="/" className="back-btn">← Back to posts</Link>

      <div className="post-detail">
        {photoSrc && <img src={photoSrc} alt={post.title} className="post-hero-img" />}
        <div className="post-detail-body">
          <div className="post-tags-row">
            <span className="post-tag">Article</span>
            <span className="post-date">{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="post-read-time">⏱ {readingTime(post.content)} min read</span>
          </div>

          <h1 className="post-title">{post.title || "Untitled"}</h1>

          <div className="post-author-row">
            <div className="post-author-avatar">{post.author?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="post-author-name">{post.author?.name}</div>
              <div className="post-author-sub">Author</div>
            </div>
          </div>

          <div className="post-content">{post.content}</div>

          <div className="post-footer">
            <div className="post-actions">
              <button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
                {liked ? "❤️" : "🤍"} {likes} {likes === 1 ? "like" : "likes"}
              </button>
              <button className={`save-btn ${saved ? "saved" : ""}`} onClick={toggleSave}>
                {saved ? "🔖 Saved" : "🔖 Save"}
              </button>
            </div>
            {isOwner && (
              <div className="post-admin-actions">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit/${post._id}`)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={deletePost}>🗑 Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CommentSection postId={id} comments={comments} setComments={setComments} />
    </div>
  );
};

export default PostDetail;
