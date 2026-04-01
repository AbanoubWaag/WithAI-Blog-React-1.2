import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Spinner, Alert } from "../components/UI";
import useFetch from "../hooks/useFetch";

const SavedPosts = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  useEffect(() => { if (!user) navigate("/login"); }, [user]);

  const { data, loading, error } = useFetch("/auth/saved");

  if (loading) return <Spinner />;
  if (error)   return <div className="container"><Alert msg={error} /></div>;

  const posts = data?.posts || [];

  return (
    <div className="container">
      <div className="page-header">
        <h1>🔖 Saved Posts</h1>
        <p>{posts.length} saved {posts.length === 1 ? "post" : "posts"}</p>
      </div>
      {posts.length === 0 ? (
        <p className="no-posts">No saved posts yet. Browse posts and save the ones you like!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
