import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useForm from "../hooks/useForm";
import { Alert } from "../components/UI";
import api from "../api/axios";

const PostForm = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();
  const isEdit       = Boolean(id);
  const fileRef      = useRef(null);

  const [error, setError]                       = useState("");
  const [loading, setLoading]                   = useState(false);
  const [preview, setPreview]                   = useState(null);
  const [importUrl, setImportUrl]               = useState("");
  const [importing, setImporting]               = useState(false);
  const [importMsg, setImportMsg]               = useState("");
  const [importedImageUrl, setImportedImageUrl] = useState("");

  const { values, handleChange, setValues } = useForm({ title: "", content: "" });

  useEffect(() => {
    if (!user) return navigate("/login");
    if (isEdit) {
      api.get(`/posts/${id}`).then((res) => {
        setValues({ title: res.data.title || "", content: res.data.content || "" });
        if (res.data.photo) {
          setPreview(res.data.photo.startsWith("http") ? res.data.photo : `http://localhost:5000${res.data.photo}`);
        }
      });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportedImageUrl("");
    setPreview(URL.createObjectURL(file));
  };

  const importFromUrl = async () => {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportMsg("");
    try {
      const res = await api.post("/scrape", { url: importUrl });
      if (res.data.title)    setValues((prev) => ({ ...prev, title: res.data.title }));
      if (res.data.content)  setValues((prev) => ({ ...prev, content: res.data.content }));
      if (res.data.imageUrl) { setImportedImageUrl(res.data.imageUrl); setPreview(res.data.imageUrl); }
      setImportMsg("✓ Article imported successfully");
      setImportUrl("");
      addToast("Article imported!");
    } catch (err) {
      setImportMsg(`✕ ${err.response?.data?.msg || "Import failed"}`);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title",   values.title);
      fd.append("content", values.content);
      const file = fileRef.current?.files[0];
      if (file) fd.append("photo", file);
      else if (importedImageUrl) fd.append("imageUrl", importedImageUrl);

      const res = isEdit ? await api.put(`/posts/${id}`, fd) : await api.post("/posts", fd);
      addToast(isEdit ? "Post updated!" : "Post published!");
      navigate(`/post/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-page">
      <Link to="/" className="back-btn">← Back</Link>

      <div className="import-box">
        <div className="import-box-header">🔗 Import article from URL</div>
        <div className="import-row">
          <input
            type="url" value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://example.com/article…"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), importFromUrl())}
          />
          <button className="btn btn-primary btn-sm" onClick={importFromUrl} disabled={importing}>
            {importing ? "Importing…" : "Import"}
          </button>
        </div>
        {importMsg && <span className={importMsg.startsWith("✓") ? "import-success" : "import-error"}>{importMsg}</span>}
      </div>

      <div className="post-form-card">
        <h1>{isEdit ? "✏️ Edit Post" : "✦ New Post"}</h1>
        <Alert msg={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={values.title} onChange={handleChange} placeholder="Give your post a title…" />
          </div>
          <div className="field">
            <label>Content</label>
            <textarea name="content" value={values.content} onChange={handleChange} placeholder="Write your story…" style={{ minHeight: "280px" }} />
          </div>
          <div className="field">
            <label>Cover Photo</label>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} />
            {preview && (
              <div className="photo-preview">
                <img src={preview} alt="preview" />
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: ".5rem" }}>
            {loading ? "Saving…" : isEdit ? "Update Post" : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
