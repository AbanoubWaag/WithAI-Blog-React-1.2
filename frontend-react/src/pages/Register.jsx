import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useForm from "../hooks/useForm";
import { Alert } from "../components/UI";
import api from "../api/axios";

const Register = () => {
  const { login }    = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { values, handleChange } = useForm({ name: "", email: "", password: "", isAdmin: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: values.name, email: values.email,
        password: values.password, role: values.isAdmin ? "admin" : "user",
      });
      login(res.data.token, res.data.user);
      addToast("Account created successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <h1>Create account</h1>
          <p className="auth-subtitle">Join our community of writers</p>
        </div>
        <Alert msg={error} />
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="Your name" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
          </div>
          <div className="field field-checkbox">
            <input type="checkbox" name="isAdmin" id="isAdmin" checked={values.isAdmin} onChange={handleChange} />
            <label htmlFor="isAdmin">Register as Admin</label>
          </div>
          <button className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: ".5rem" }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
