import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";
import { Spinner, Alert } from "../components/UI";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [page, setPage] = useState(1);

  const searchParam = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => { setPage(1); }, [searchParam]);

  const url = searchParam
    ? `/posts?page=${page}&limit=9&search=${encodeURIComponent(searchParam)}`
    : `/posts?page=${page}&limit=9`;

  const { data, loading, error } = useFetch(url);
  const statsData = useFetch("/posts?limit=1");

  if (loading) return <Spinner />;
  if (error)   return <div className="container"><Alert msg={error} /></div>;

  const { posts, pages, total } = data;

  return (
    <>
      {!searchParam && (
        <div className="hero">
          <h1>Discover Amazing Stories</h1>
          <p>Read, write, and share articles on topics you love. Join our growing community of writers.</p>
          {user ? (
            <Link to="/new-post">
              <button className="btn btn-primary">✦ Write a Post</button>
            </Link>
          ) : (
            <Link to="/register">
              <button className="btn btn-primary">Get Started Free</button>
            </Link>
          )}
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">{statsData.data?.total || 0}</div>
              <div className="hero-stat-label">Articles</div>
            </div>
            <div>
              <div className="hero-stat-num">∞</div>
              <div className="hero-stat-label">Ideas</div>
            </div>
            <div>
              <div className="hero-stat-num">24/7</div>
              <div className="hero-stat-label">Available</div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            {searchParam ? `Results for "${searchParam}"` : "Latest Posts"}
            {total > 0 && <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: ".9rem", marginLeft: ".5rem" }}>({total})</span>}
          </h2>
        </div>

        {posts.length === 0 ? (
          <p className="no-posts">
            {searchParam ? `No posts found for "${searchParam}"` : "No posts yet. Be the first to write!"}
          </p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>←</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>→</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
