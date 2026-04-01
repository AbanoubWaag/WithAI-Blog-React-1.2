import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api/axios";

const CommentSection = ({ postId, comments, setComments }) => {
  const { user }     = useAuth();
  const { addToast } = useToast();
  const [content, setContent]           = useState("");
  const [error, setError]               = useState("");
  const [replyBoxes, setReplyBoxes]     = useState({});
  const [replyContent, setReplyContent] = useState({});

  const submitComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content });
      setComments((prev) => [...prev, res.data]);
      setContent("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to post comment");
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    await api.delete(`/comments/${id}`);
    setComments((prev) => prev.filter((c) => c._id !== id));
    addToast("Comment deleted", "info");
  };

  const likeComment = async (id) => {
    const res = await api.post(`/comments/${id}/like`);
    setComments((prev) =>
      prev.map((c) => c._id === id ? { ...c, likes: Array(res.data.likes).fill(null), _liked: res.data.liked } : c)
    );
  };

  const submitReply = async (commentId) => {
    const text = replyContent[commentId]?.trim();
    if (!text) return;
    const res = await api.post(`/comments/${commentId}/replies`, { content: text });
    setComments((prev) =>
      prev.map((c) => c._id === commentId ? { ...c, replies: [...(c.replies || []), res.data] } : c)
    );
    setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    setReplyBoxes((prev) => ({ ...prev, [commentId]: false }));
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60)    return `${s}s ago`;
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments</h3>
        <span className="comments-count">{comments.length}</span>
      </div>

      {user ? (
        <form onSubmit={submitComment} className="comment-input-wrap">
          <div className="comment-input-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div className="comment-input-inner">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts…"
            />
            <button className="btn btn-primary btn-sm" type="submit">Post</button>
          </div>
        </form>
      ) : (
        <p className="login-prompt"><Link to="/login">Login</Link> to join the conversation.</p>
      )}

      {error && <p style={{ color: "var(--danger)", fontSize: ".85rem", marginBottom: "1rem" }}>{error}</p>}

      {comments.map((c) => (
        <div key={c._id} className="comment-item">
          <div className="comment-avatar">{c.author?.name?.[0]?.toUpperCase()}</div>
          <div className="comment-body">
            <div className="comment-meta">
              <span className="comment-author">{c.author?.name}</span>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="comment-text">{c.content}</p>
            <div className="comment-actions">
              {user && (
                <>
                  <button className={`action-btn ${c._liked ? "liked-action" : ""}`} onClick={() => likeComment(c._id)}>
                    {c._liked ? "❤️" : "🤍"} {c.likes?.length || 0}
                  </button>
                  <button className="action-btn" onClick={() => setReplyBoxes((prev) => ({ ...prev, [c._id]: !prev[c._id] }))}>
                    💬 Reply
                  </button>
                </>
              )}
              {user && (user.id === c.author?._id || user.role === "admin") && (
                <button className="action-btn delete-action" onClick={() => deleteComment(c._id)}>🗑 Delete</button>
              )}
            </div>

            {replyBoxes[c._id] && (
              <div className="reply-form">
                <input
                  value={replyContent[c._id] || ""}
                  onChange={(e) => setReplyContent((prev) => ({ ...prev, [c._id]: e.target.value }))}
                  placeholder={`Reply to ${c.author?.name}…`}
                  onKeyDown={(e) => e.key === "Enter" && submitReply(c._id)}
                />
                <button className="btn btn-primary btn-sm" onClick={() => submitReply(c._id)}>Reply</button>
              </div>
            )}

            {(c.replies || []).length > 0 && (
              <div className="replies-list">
                {c.replies.map((r) => (
                  <div key={r._id} className="reply-item">
                    <div className="reply-avatar">{r.author?.name?.[0]?.toUpperCase()}</div>
                    <div className="reply-body">
                      <span className="reply-author">{r.author?.name}</span>
                      <span className="reply-time">{timeAgo(r.createdAt)}</span>
                      <p className="reply-text">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
