import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useForm from "../hooks/useForm";
import { Alert } from "../components/UI";
import api from "../api/axios";

const Login = () => {
  const { login }   = useAuth();
  const { addToast } = useToast();
  const navigate    = useNavigate();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { values, handleChange } = useForm({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      login(res.data.token, res.data.user);
      addToast(`Welcome back, ${res.data.user.name}!`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        <Alert msg={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: ".5rem" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="auth-footer">No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};

export default Login;
